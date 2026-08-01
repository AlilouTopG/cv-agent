// Smart CV Data Extraction & AI Enrichment Engine - CV Agent by Nexus
export function extractCVData(currentData, userMessage, step) {
  let updatedData = { ...currentData };
  let nextStep = step;
  let responseMessage = "";

  switch (step) {
    case 0:
      updatedData.fullName = userMessage;
      nextStep = 1;
      responseMessage = `Pleasure to meet you, ${userMessage}! What is your current target role or field of expertise? (e.g., Full-Stack Engineer, Student, Data Analyst)`;
      break;

    case 1: {
      let inputLower = userMessage.toLowerCase();
      let enhancedProfession = userMessage;
      let extraSummary = "";

      if (inputLower.includes("student") || inputLower.includes("academic") || inputLower.includes("graduate")) {
        enhancedProfession = `${userMessage} | Motivated & Driven Learner`;
        extraSummary = "Ambitious academic background with strong dedication to skill acquisition, collaborative teamwork, and delivering results in fast-paced environments.";
      } else if (inputLower.includes("developer") || inputLower.includes("engineer") || inputLower.includes("software") || inputLower.includes("coder")) {
        enhancedProfession = `${userMessage} | Full-Stack Software Engineer`;
        extraSummary = "Results-driven Developer focused on writing clean, scalable code and building modern digital products with modern web technologies and agile practices.";
      } else {
        enhancedProfession = `${userMessage} | Dedicated Professional`;
        extraSummary = "Motivated professional committed to achieving operational excellence, continuous learning, and driving team success.";
      }

      updatedData.profession = enhancedProfession;
      updatedData.summary = extraSummary;
      nextStep = 2;
      responseMessage = "Excellent! I have enriched your professional profile summary. Now, list your key technical and core skills (comma-separated):";
      break;
    }

    case 2:
      updatedData.skills = userMessage.split(',').map(s => s.trim()).filter(Boolean);
      nextStep = 3;
      responseMessage = "Great lineup of skills! Briefly mention your key work experiences, achievements, or featured projects:";
      break;

    case 3:
      updatedData.experience = userMessage;
      nextStep = 4;
      responseMessage = "Your professional CV has been successfully generated and formatted! You can review the live preview and export it as PDF.";
      break;

    default:
      responseMessage = "All details are set! Your CV is ready for export.";
  }

  return { updatedData, nextStep, responseMessage };
}
