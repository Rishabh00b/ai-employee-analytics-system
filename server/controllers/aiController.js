const axios = require('axios');
const Employee = require('../models/Employee');

// @desc    Generate AI recommendation for an employee or all employees
// @route   POST /api/ai/recommend
// @access  Private
const generateRecommendation = async (req, res) => {
  try {
    const { employeeId, type } = req.body;
    
    // type could be 'promotion', 'training', 'ranking', 'feedback'
    let promptContext = '';
    let systemPrompt = 'You are an expert HR AI assistant. Provide structured JSON responses. Always reply ONLY with valid JSON. Do not include markdown formatting like ```json ... ```.';
    
    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      promptContext = `Analyze the following employee:\nName: ${employee.name}\nDepartment: ${employee.department}\nExperience: ${employee.experience} years\nPerformance Score: ${employee.performanceScore}/100\nSkills: ${employee.skills.join(', ')}\n\n`;
      
      if (type === 'promotion') {
        promptContext += 'Based on this data, should this employee be recommended for a promotion? Provide reasoning and a boolean "recommendPromotion" field. Format response as {"recommendPromotion": true/false, "reasoning": "..."}';
      } else if (type === 'training') {
        promptContext += 'Based on their skills and performance, suggest 3 training programs they should take to improve. Format response as {"suggestedTrainings": [{"name": "...", "reason": "..."}]}';
      } else if (type === 'feedback') {
        promptContext += 'Generate constructive feedback for this employee highlighting strengths and areas of improvement. Format response as {"strengths": ["..."], "improvements": ["..."], "summary": "..."}';
      }
    } else if (type === 'ranking') {
      const employees = await Employee.find({});
      const employeesData = employees.map(emp => ({
        id: emp._id,
        name: emp.name,
        department: emp.department,
        performanceScore: emp.performanceScore,
        experience: emp.experience
      }));
      
      promptContext = `Analyze the following list of employees: ${JSON.stringify(employeesData)}\n\nRank the top 3 employees for a leadership role based on performance and experience. Format response as {"topRankings": [{"id": "...", "name": "...", "reason": "..."}]}`;
    } else {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptContext }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    try {
      // Attempt to parse standard JSON output (strip out potential markdown formatting)
      const cleanJsonStr = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);
      res.json(parsedData);
    } catch (parseError) {
      // Fallback if AI didn't return perfect JSON
      res.json({ rawResponse: aiResponse, error: "Failed to parse AI response as JSON" });
    }

  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate AI recommendation' });
  }
};

// @desc    General conversational AI chatbot
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages array format' });
    }

    // Fetch all employees for context
    const employees = await Employee.find({});
    const employeeData = employees.map(emp => ({
      name: emp.name,
      department: emp.department,
      skills: emp.skills,
      performanceScore: emp.performanceScore,
      experience: emp.experience
    }));

    const systemPrompt = `You are a helpful HR AI Assistant. You have access to the following employee database context: ${JSON.stringify(employeeData)}. Answer the user's questions about the employees concisely and accurately based ONLY on this context. Format your response cleanly using markdown if needed, but do not use markdown code blocks unless writing code.`;

    // Construct full message history for the AI
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: apiMessages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error('AI Chat Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to process chat response' });
  }
};

module.exports = { generateRecommendation, chatWithAI };
