export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { anthropic, CLAUDE_MODEL } from '@/lib/claude';
import { SILAS_PROMPT } from '@/lib/silas-prompt';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API /api/generate called');
    
    // Check if API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('🔑 API key exists:', !!apiKey);
    console.log('🔑 API key starts with:', apiKey?.substring(0, 10) || 'NONE');
    
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY is not set in environment variables!');
      return NextResponse.json(
        { error: 'API key not configured. Please set ANTHROPIC_API_KEY in Vercel environment variables.' },
        { status: 500 }
      );
    }
    
    const formData = await request.formData();
    const background = formData.get('background') as string;
    const programName = formData.get('programName') as string;
    const universityName = formData.get('universityName') as string;
    const essayType = formData.get('essayType') as string;
    const wordCount = formData.get('wordCount') as string;
    const customPrompt = formData.get('customPrompt') as string;

    console.log('📋 Received data:', {
      backgroundLength: background?.length || 0,
      programName,
      universityName,
      essayType,
      wordCount,
    });

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

    // Log raw response for debugging
    console.log('🔹 Raw Claude response:', JSON.stringify(response, null, 2));
    console.log('🔹 Response stop_reason:', response.stop_reason);
    console.log('🔹 Response content array:', response.content);

    // Extract text from response - SIMPLEST method
    let fullResponse = '';
    
    if (response.content && Array.isArray(response.content)) {
      console.log('📦 Content blocks count:', response.content.length);
      
      for (let i = 0; i < response.content.length; i++) {
        const block = response.content[i];
        console.log(`📦 Block ${i} type:`, block.type);
        
        if (block.type === 'text') {
          const text = block.text || '';
          console.log(`📦 Block ${i} text length:`, text.length);
          fullResponse += text;
        }
      }
    }

    console.log('📝 FINAL extracted text length:', fullResponse.length);
    console.log('📝 First 500 chars:', fullResponse.substring(0, 500));

    if (!fullResponse || fullResponse.trim().length === 0) {
      console.error('❌ Claude returned empty response!');
      console.error('❌ Full response object:', response);
      return NextResponse.json(
        { 
          error: 'Claude returned an empty response. Please check API key and credits.',
          debug: {
            contentBlocks: response.content?.length || 0,
            stopReason: response.stop_reason,
          }
        },
        { status: 500 }
      );
    }

    // Parse the response to extract sections
    const sections = parseEssayResponse(fullResponse);

    console.log('✅ Parsed sections:', {
      hasEssay: !!sections.essay,
      essayLength: sections.essay?.length || 0,
      hasAnalysis: !!sections.analysis,
      hasAudit: !!sections.audit,
    });

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
