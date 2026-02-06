export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { anthropic, CLAUDE_MODEL } from '@/lib/claude';
import { SILAS_PROMPT } from '@/lib/silas-prompt';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const background = formData.get('background') as string;
    const programName = formData.get('programName') as string;
    const universityName = formData.get('universityName') as string;
    const essayType = formData.get('essayType') as string;
    const wordCount = formData.get('wordCount') as string;
    const customPrompt = formData.get('customPrompt') as string;

    // Validate required fields
    if (!background || !programName || !universityName || !essayType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build the user message
    const userMessage = `
CV/Resume:
${background}

Program: ${programName}
University: ${universityName}
Essay Type: ${essayType}
Word Count Target: ${wordCount || 650}
${customPrompt ? `Custom Instructions: ${customPrompt}` : ''}

Generate the complete essay package now.
`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      temperature: 1.0,
      system: SILAS_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract text from response
    const fullResponse = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as any).text)
      .join('\n');

    // Parse the response to extract sections
    const sections = parseEssayResponse(fullResponse);

    return NextResponse.json({
      success: true,
      essay: sections.essay,
      audit: sections.audit,
      analysis: sections.analysis,
      fullResponse,
    });
  } catch (error: any) {
    console.error('Essay generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate essay' },
      { status: 500 }
    );
  }
}

function parseEssayResponse(response: string) {
  const sections = {
    analysis: '',
    essay: '',
    audit: '',
  };

  // Extract Essay Strategy Analysis
  const analysisMatch = response.match(/=== ESSAY STRATEGY ANALYSIS ===([\s\S]*?)(?:===|$)/);
  if (analysisMatch) {
    sections.analysis = analysisMatch[1].trim();
  }

  // Extract Draft Essay
  const essayMatch = response.match(/=== DRAFT ESSAY ===([\s\S]*?)(?:===|$)/);
  if (essayMatch) {
    sections.essay = essayMatch[1].trim();
  }

  // Extract Post-Draft Audit
  const auditMatch = response.match(/=== POST-DRAFT AUDIT ===([\s\S]*?)(?:===|$)/);
  if (auditMatch) {
    sections.audit = auditMatch[1].trim();
  }

  // If parsing fails, return the full response as essay
  if (!sections.essay && response) {
    sections.essay = response;
  }

  return sections;
}
