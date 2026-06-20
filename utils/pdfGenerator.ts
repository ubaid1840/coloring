import jsPDF from "jspdf";

interface LessonPlanData {
  title: string;
  description: string;
  subjects: string[];
  schoolType: string;
  duration: string;
  difficulty: string;
  pages: number;
}

interface WorksheetData {
  title: string;
  description: string;
  subject: string;
  ageRange: string;
  pages: number;
}

interface ResourceGuideData {
  title: string;
  description: string;
  topics: string[];
  audience: string;
  pages: number;
}

// ColoringFunAI Theme Colors
const THEME = {
  primary: { r: 80, g: 136, b: 118 },      // Sage green - HSL(158, 35%, 45%)
  accent: { r: 224, g: 127, b: 102 },       // Coral/Terracotta - HSL(15, 70%, 60%)
  cream: { r: 250, g: 247, b: 240 },        // Cream background - HSL(40, 33%, 97%)
  warmGray: { r: 245, g: 242, b: 235 },     // Warm gray for boxes
  text: { r: 45, g: 40, b: 35 },            // Dark warm text
  muted: { r: 120, g: 110, b: 100 },        // Muted text
};

const addHeader = (doc: jsPDF, title: string, subtitle: string) => {
  // Header background - Sage green gradient effect
  doc.setFillColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.rect(0, 0, 210, 45, "F");
  
  // Decorative accent stripe
  doc.setFillColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
  doc.rect(0, 42, 210, 3, "F");
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 25);
  
  // Subtitle
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 20, 35);
  
  // Reset text color
  doc.setTextColor(THEME.text.r, THEME.text.g, THEME.text.b);
};

const addSection = (doc: jsPDF, title: string, content: string[], startY: number): number => {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.text(title, 20, startY);
  
  // Decorative underline
  doc.setDrawColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
  doc.setLineWidth(1);
  doc.line(20, startY + 2, 60, startY + 2);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(THEME.text.r, THEME.text.g, THEME.text.b);
  
  let y = startY + 10;
  content.forEach((line) => {
    const splitLines = doc.splitTextToSize(line, 170);
    splitLines.forEach((splitLine: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitLine, 20, y);
      y += 6;
    });
    y += 2;
  });
  
  return y + 5;
};

const addBulletPoints = (doc: jsPDF, items: string[], startY: number): number => {
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(THEME.text.r, THEME.text.g, THEME.text.b);
  
  let y = startY;
  items.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    // Coral bullet point
    doc.setFillColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
    doc.circle(27, y - 1.5, 1.5, "F");
    const splitLines = doc.splitTextToSize(item, 158);
    splitLines.forEach((line: string, index: number) => {
      doc.text(line, 34, y + (index * 6));
    });
    y += splitLines.length * 6 + 3;
  });
  
  return y + 5;
};

const addFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer accent line
    doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
    doc.setLineWidth(0.5);
    doc.line(20, 282, 190, 282);
    
    doc.setFontSize(9);
    doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
    doc.text(`Page ${i} of ${pageCount}`, 105, 288, { align: "center" });
    
    // Brand with coral accent
    doc.setTextColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
    doc.text("ColoringFunAI", 85, 294);
    doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
    doc.text(" - Educational Coloring Resources", 103, 294);
  }
};

export const generateLessonPlanPDF = (lesson: LessonPlanData): jsPDF => {
  const doc = new jsPDF();
  
  addHeader(doc, lesson.title, "Comprehensive Lesson Plan");
  
  // Metadata box with cream/warm background
  doc.setFillColor(THEME.warmGray.r, THEME.warmGray.g, THEME.warmGray.b);
  doc.roundedRect(15, 50, 180, 28, 3, 3, "F");
  
  // Accent border
  doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 50, 180, 28, 3, 3);
  
  doc.setFontSize(10);
  doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
  doc.text(`Subjects: ${lesson.subjects.join(", ")}`, 20, 60);
  doc.text(`Grade Level: ${lesson.schoolType}`, 20, 68);
  doc.text(`Duration: ${lesson.duration}`, 120, 60);
  doc.text(`Difficulty: ${lesson.difficulty}`, 120, 68);
  
  let y = 88;
  
  // Overview - use the actual description
  y = addSection(doc, "Lesson Overview", [lesson.description], y);
  
  // Generate subject-specific objectives
  const subjectObjectives = generateSubjectObjectives(lesson.subjects, lesson.title);
  y = addSection(doc, "Learning Objectives", [], y);
  y = addBulletPoints(doc, subjectObjectives, y);
  
  // Standards Alignment
  const standards = generateStandardsAlignment(lesson.subjects, lesson.schoolType);
  y = addSection(doc, "Standards Alignment", [], y);
  y = addBulletPoints(doc, standards, y);
  
  // Subject-specific materials
  const materials = generateMaterials(lesson.subjects, lesson.title);
  y = addSection(doc, "Materials Needed", [], y);
  y = addBulletPoints(doc, materials, y);
  
  // Page 2: Lesson Procedure
  doc.addPage();
  y = 20;
  
  // Subject-specific procedure
  y = addSection(doc, "Lesson Procedure", [], y);
  
  const introMinutes = parseInt(lesson.duration) <= 30 ? 5 : 10;
  const mainMinutes = parseInt(lesson.duration) <= 30 ? 20 : parseInt(lesson.duration) - 20;
  const wrapMinutes = parseInt(lesson.duration) <= 30 ? 5 : 10;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
  doc.text(`Introduction (${introMinutes} minutes)`, 20, y);
  y += 8;
  const introSteps = generateIntroduction(lesson.title, lesson.subjects);
  y = addBulletPoints(doc, introSteps, y);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
  doc.text(`Main Activity (${mainMinutes} minutes)`, 20, y);
  y += 8;
  const mainSteps = generateMainActivity(lesson.title, lesson.subjects, lesson.difficulty);
  y = addBulletPoints(doc, mainSteps, y);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
  doc.text(`Wrap-Up (${wrapMinutes} minutes)`, 20, y);
  y += 8;
  const wrapSteps = generateWrapUp(lesson.title, lesson.subjects);
  y = addBulletPoints(doc, wrapSteps, y);
  
  // Assessment
  const assessments = generateAssessments(lesson.subjects, lesson.difficulty);
  y = addSection(doc, "Assessment Strategies", [], y);
  y = addBulletPoints(doc, assessments, y);
  
  // Page 3: Sample Activities & Differentiation
  doc.addPage();
  y = 20;
  
  // Sample Activity 1
  y = addSection(doc, "Sample Activity 1: Guided Exploration", [], y);
  const activity1 = generateSampleActivity1(lesson.title, lesson.subjects, lesson.difficulty);
  y = addBulletPoints(doc, activity1, y);
  
  // Sample Activity 2
  y = addSection(doc, "Sample Activity 2: Creative Application", [], y);
  const activity2 = generateSampleActivity2(lesson.title, lesson.subjects);
  y = addBulletPoints(doc, activity2, y);
  
  // Differentiation Strategies
  y = addSection(doc, "Differentiation Strategies", [], y);
  const differentiation = generateDifferentiation(lesson.difficulty, lesson.schoolType);
  y = addBulletPoints(doc, differentiation, y);
  
  // Page 4: Extensions, Cross-Curricular, and Teacher Notes
  doc.addPage();
  y = 20;
  
  // Extensions
  const extensions = generateExtensions(lesson.title, lesson.subjects);
  y = addSection(doc, "Extension Activities", [], y);
  y = addBulletPoints(doc, extensions, y);
  
  // Cross-Curricular Connections
  const crossCurricular = generateCrossCurricular(lesson.subjects, lesson.title);
  y = addSection(doc, "Cross-Curricular Connections", [], y);
  y = addBulletPoints(doc, crossCurricular, y);
  
  // Teacher Notes & Reflection
  y = addSection(doc, "Teacher Notes & Reflection", [], y);
  const teacherNotes = [
    "Document student engagement levels and adjust pacing as needed",
    "Note which activities generated the most interest for future lessons",
    "Record any modifications made for individual student needs",
    "Reflect on time management and classroom flow"
  ];
  y = addBulletPoints(doc, teacherNotes, y);
  
  // Reflection Space with themed border
  doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.setLineWidth(0.8);
  doc.roundedRect(20, y, 170, 40, 3, 3);
  doc.setFontSize(9);
  doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
  doc.text("Space for lesson reflection notes:", 25, y + 8);
  
  addFooter(doc, 1, 4);
  
  return doc;
};

// New helper function for standards alignment
const generateStandardsAlignment = (subjects: string[], schoolType: string): string[] => {
  const standards: string[] = [];
  
  subjects.forEach(subject => {
    switch (subject.toLowerCase()) {
      case "science":
        standards.push("NGSS: Aligns with Next Generation Science Standards for inquiry-based learning");
        break;
      case "math":
        standards.push("CCSS-Math: Supports Common Core State Standards for Mathematical Practice");
        break;
      case "art":
        standards.push("NCAS: Meets National Core Arts Standards for creating and responding");
        break;
      case "language arts":
        standards.push("CCSS-ELA: Supports English Language Arts standards for literacy development");
        break;
      case "social studies":
      case "geography":
      case "history":
        standards.push("C3 Framework: Aligns with College, Career, and Civic Life Framework");
        break;
      case "wellness":
      case "sel":
        standards.push("CASEL: Meets Collaborative for Academic, Social, and Emotional Learning competencies");
        break;
      default:
        standards.push(`Supports grade-level ${subject} curriculum standards`);
    }
  });
  
  if (schoolType.includes("Kindergarten") || schoolType.includes("Pre-K")) {
    standards.push("Developmentally Appropriate Practice (DAP): Designed for early learners");
  }
  
  return standards;
};

// New helper for sample activity 1
const generateSampleActivity1 = (title: string, subjects: string[], difficulty: string): string[] => {
  const activity: string[] = [];
  
  activity.push(`Objective: Introduce core concepts of ${title.toLowerCase()} through guided discovery`);
  activity.push("Step 1: Display the coloring page on the board or projector for whole-class viewing");
  activity.push("Step 2: Ask guiding questions about what students observe in the image");
  
  if (subjects.some(s => s.toLowerCase() === "science")) {
    activity.push("Step 3: Have students predict what they will learn and record in science journals");
    activity.push("Step 4: Guide students to color specific sections while discussing scientific concepts");
  } else if (subjects.some(s => s.toLowerCase() === "math")) {
    activity.push("Step 3: Identify mathematical elements (shapes, patterns, numbers) in the design");
    activity.push("Step 4: Color sections according to mathematical rules or problem solutions");
  } else {
    activity.push("Step 3: Discuss the artistic and educational elements present in the image");
    activity.push("Step 4: Begin coloring with intentional color choices that reflect learning");
  }
  
  activity.push("Step 5: Pause periodically for partner discussions about discoveries");
  
  return activity;
};

// New helper for sample activity 2
const generateSampleActivity2 = (title: string, subjects: string[]): string[] => {
  const activity: string[] = [];
  
  activity.push("Objective: Apply learned concepts through creative expression");
  activity.push("Materials: Completed coloring page, blank paper, writing materials");
  activity.push("Procedure:");
  activity.push("  - Students complete their coloring pages independently");
  activity.push("  - On the blank paper, students create a related original illustration");
  activity.push("  - Write 3-5 sentences explaining their artistic choices and what they learned");
  activity.push("  - Share creations with a partner or small group");
  activity.push("Extension: Create a class gallery wall displaying all completed work");
  
  return activity;
};

// New helper for differentiation
const generateDifferentiation = (difficulty: string, schoolType: string): string[] => {
  const strategies: string[] = [];
  
  strategies.push("For Struggling Learners:");
  strategies.push("  - Provide pre-colored examples as visual guides");
  strategies.push("  - Offer simplified versions with fewer details");
  strategies.push("  - Pair with a supportive peer partner");
  
  strategies.push("For Advanced Learners:");
  strategies.push("  - Add research components or extended writing");
  strategies.push("  - Provide more complex designs with additional challenges");
  strategies.push("  - Encourage teaching concepts to peers");
  
  strategies.push("For English Language Learners:");
  strategies.push("  - Include visual vocabulary cards with key terms");
  strategies.push("  - Allow verbal responses instead of written work");
  strategies.push("  - Provide native language support materials when available");
  
  if (schoolType.includes("Kindergarten") || schoolType.includes("Pre-K")) {
    strategies.push("For Early Learners: Use larger images with bold lines, chunky crayons");
  }
  
  return strategies;
};

// New helper for cross-curricular connections
const generateCrossCurricular = (subjects: string[], title: string): string[] => {
  const connections: string[] = [];
  
  if (!subjects.some(s => s.toLowerCase() === "math")) {
    connections.push("Math Connection: Count objects in the image, measure completed work, analyze patterns");
  }
  if (!subjects.some(s => s.toLowerCase() === "language arts")) {
    connections.push("Language Arts: Write descriptive paragraphs about the completed artwork");
  }
  if (!subjects.some(s => s.toLowerCase() === "science")) {
    connections.push("Science: Explore the scientific principles behind the subject matter");
  }
  if (!subjects.some(s => s.toLowerCase() === "social studies")) {
    connections.push("Social Studies: Research the cultural or historical significance of the theme");
  }
  
  connections.push("Music: Listen to themed music while coloring to enhance the experience");
  connections.push("Physical Education: Take movement breaks with actions related to the lesson theme");
  
  return connections;
};

// Helper functions to generate content-specific text
const generateSubjectObjectives = (subjects: string[], title: string): string[] => {
  const objectives: string[] = [];
  const titleLower = title.toLowerCase();
  
  subjects.forEach(subject => {
    switch (subject.toLowerCase()) {
      case "science":
        if (titleLower.includes("animal")) objectives.push("Identify different animal species and their unique physical characteristics");
        else if (titleLower.includes("ocean") || titleLower.includes("marine")) objectives.push("Understand marine ecosystems and ocean life biodiversity");
        else if (titleLower.includes("space") || titleLower.includes("astronomy")) objectives.push("Learn about celestial bodies, planets, and the solar system");
        else if (titleLower.includes("dinosaur")) objectives.push("Explore prehistoric life and geological time periods");
        else if (titleLower.includes("plant") || titleLower.includes("botanical")) objectives.push("Study plant anatomy, life cycles, and photosynthesis");
        else if (titleLower.includes("body") || titleLower.includes("anatomy")) objectives.push("Understand human body systems and organ functions");
        else if (titleLower.includes("weather") || titleLower.includes("climate")) objectives.push("Analyze weather patterns and atmospheric phenomena");
        else if (titleLower.includes("insect") || titleLower.includes("bug")) objectives.push("Examine insect anatomy, life cycles, and ecological roles");
        else if (titleLower.includes("bird")) objectives.push("Identify bird species and understand avian biology");
        else if (titleLower.includes("environment")) objectives.push("Understand ecosystems, conservation, and environmental protection");
        else objectives.push("Apply scientific observation and inquiry skills through visual exploration");
        break;
      case "math":
        if (titleLower.includes("number") || titleLower.includes("counting")) objectives.push("Master number recognition and counting sequences");
        else if (titleLower.includes("geometry") || titleLower.includes("shape")) objectives.push("Identify and classify geometric shapes and their properties");
        else if (titleLower.includes("symmetry")) objectives.push("Recognize and create symmetrical patterns and designs");
        else if (titleLower.includes("pattern")) objectives.push("Identify, extend, and create mathematical patterns");
        else objectives.push("Develop mathematical reasoning through visual pattern analysis");
        break;
      case "art":
        if (titleLower.includes("color")) objectives.push("Master color theory including primary, secondary, and complementary colors");
        else if (titleLower.includes("mandala")) objectives.push("Create balanced, symmetrical designs using radial patterns");
        else if (titleLower.includes("history")) objectives.push("Recognize artistic styles from different historical periods");
        else objectives.push("Develop artistic expression and creative visualization skills");
        break;
      case "history":
        if (titleLower.includes("ancient") || titleLower.includes("civilization")) objectives.push("Explore ancient civilizations and their artistic contributions");
        else if (titleLower.includes("transportation")) objectives.push("Trace the evolution of transportation through history");
        else objectives.push("Connect historical events and cultural developments through visual learning");
        break;
      case "language arts":
        if (titleLower.includes("writing") || titleLower.includes("story")) objectives.push("Develop narrative skills and creative storytelling abilities");
        else if (titleLower.includes("fairy") || titleLower.includes("tale")) objectives.push("Analyze story elements, characters, and plot structures");
        else objectives.push("Enhance vocabulary and reading comprehension through illustrated activities");
        break;
      case "social studies":
      case "geography":
        if (titleLower.includes("culture")) objectives.push("Appreciate cultural diversity and global traditions");
        else if (titleLower.includes("map") || titleLower.includes("geography")) objectives.push("Develop spatial awareness and geographic knowledge");
        else if (titleLower.includes("community")) objectives.push("Understand community roles and civic responsibility");
        else objectives.push("Explore social systems and cultural connections");
        break;
      case "wellness":
      case "sel":
        if (titleLower.includes("mindful") || titleLower.includes("focus")) objectives.push("Practice mindfulness techniques for improved focus and calm");
        else if (titleLower.includes("emotion")) objectives.push("Identify and express emotions in healthy, constructive ways");
        else objectives.push("Develop self-regulation and emotional awareness skills");
        break;
      case "music":
        objectives.push("Connect visual patterns with musical rhythm and beat concepts");
        break;
      case "health":
        if (titleLower.includes("eating") || titleLower.includes("nutrition")) objectives.push("Understand nutritional basics and healthy food choices");
        else objectives.push("Learn about healthy lifestyle choices and body care");
        break;
    }
  });
  
  // Add universal objectives
  objectives.push("Develop fine motor skills and hand-eye coordination through coloring");
  objectives.push("Practice focus, patience, and attention to detail");
  
  return objectives;
};

const generateMaterials = (subjects: string[], title: string): string[] => {
  const materials = [
    `Printed "${title}" coloring pages (one set per student)`,
    "Colored pencils in assorted colors",
    "Crayons or markers (optional alternatives)"
  ];
  
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes("science") || subjects.includes("Science")) {
    materials.push("Reference charts or posters related to the topic");
  }
  if (titleLower.includes("math") || subjects.includes("Math")) {
    materials.push("Rulers for measuring activities");
  }
  if (titleLower.includes("writing") || titleLower.includes("story")) {
    materials.push("Blank paper for creative writing extension");
  }
  if (titleLower.includes("craft") || titleLower.includes("art history")) {
    materials.push("Scissors and glue for craft extensions");
  }
  
  materials.push("Pencils for written activities");
  materials.push("Student journals or reflection sheets");
  
  return materials;
};

const generateIntroduction = (title: string, subjects: string[]): string[] => {
  const intro = [
    `Introduce the topic of "${title}" with engaging discussion questions`,
    "Show visual examples and real-world connections to spark interest",
    "Preview the coloring activity and explain learning objectives"
  ];
  return intro;
};

const generateMainActivity = (title: string, subjects: string[], difficulty: string): string[] => {
  const steps = [
    `Distribute the "${title}" coloring pages and materials`,
    "Guide students through the activity with clear instructions"
  ];
  
  if (difficulty === "Beginner") {
    steps.push("Provide simple, step-by-step guidance for younger learners");
  } else if (difficulty === "Advanced") {
    steps.push("Encourage independent exploration with challenging elements");
  } else {
    steps.push("Balance guided instruction with creative freedom");
  }
  
  steps.push("Circulate to provide individual support and enrichment");
  steps.push("Facilitate subject-related discussions while students work");
  
  return steps;
};

const generateWrapUp = (title: string, subjects: string[]): string[] => {
  return [
    "Have students share their completed work with partners or the class",
    `Discuss key learnings related to ${subjects.join(" and ")}`,
    "Connect the activity to upcoming lessons and broader concepts",
    "Celebrate effort and creativity in student work"
  ];
};

const generateAssessments = (subjects: string[], difficulty: string): string[] => {
  const assessments = [
    "Observe student engagement and on-task behavior during activity",
    "Review completed work for understanding and attention to detail"
  ];
  
  if (difficulty === "Advanced") {
    assessments.push("Written reflection or journal entry on key concepts");
    assessments.push("Oral presentation or explanation of their work");
  } else {
    assessments.push("Class discussion to check for understanding");
    assessments.push("Participation in group sharing activities");
  }
  
  return assessments;
};

const generateExtensions = (title: string, subjects: string[]): string[] => {
  const extensions = [
    `Create a classroom display showcasing "${title}" student artwork`,
    "Send home additional coloring pages for family involvement"
  ];
  
  if (subjects.includes("Science")) {
    extensions.push("Research project on related scientific concepts");
  }
  if (subjects.includes("Art")) {
    extensions.push("Create original artwork inspired by the lesson theme");
  }
  if (subjects.includes("Language Arts")) {
    extensions.push("Write a story or poem related to the coloring images");
  }
  if (subjects.includes("Math")) {
    extensions.push("Create original patterns using learned concepts");
  }
  
  return extensions;
};

export const generateWorksheetPDF = (worksheet: WorksheetData): jsPDF => {
  const doc = new jsPDF();
  
  addHeader(doc, worksheet.title, "Educational Worksheet");
  
  // Metadata box with cream/warm background
  doc.setFillColor(THEME.warmGray.r, THEME.warmGray.g, THEME.warmGray.b);
  doc.roundedRect(15, 50, 180, 25, 3, 3, "F");
  
  // Accent border
  doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 50, 180, 25, 3, 3);
  
  doc.setFontSize(10);
  doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
  doc.text(`Subject: ${worksheet.subject}`, 20, 60);
  doc.text(`Age Range: ${worksheet.ageRange}`, 20, 68);
  
  let y = 85;
  
  // Description - use actual description
  y = addSection(doc, `About "${worksheet.title}"`, [worksheet.description], y);
  
  // Subject-specific instructions
  const instructions = generateWorksheetInstructions(worksheet.subject, worksheet.title, worksheet.ageRange);
  y = addSection(doc, "Instructions for Use", [], y);
  y = addBulletPoints(doc, instructions, y);
  
  // Subject-specific learning goals
  const learningGoals = generateWorksheetGoals(worksheet.subject, worksheet.title);
  y = addSection(doc, "Learning Goals", [], y);
  y = addBulletPoints(doc, learningGoals, y);
  
  // Page 2: Activity Section
  doc.addPage();
  y = 20;
  
  // Subject-specific activities
  const activities = generateWorksheetActivities(worksheet.subject, worksheet.title);
  y = addSection(doc, "Worksheet Activities", [], y);
  y = addBulletPoints(doc, activities, y);
  
  // Draw a sample activity area with theme colors
  doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.setLineWidth(1);
  doc.roundedRect(20, y, 170, 60, 5, 5);
  
  doc.setFontSize(14);
  doc.setTextColor(THEME.accent.r, THEME.accent.g, THEME.accent.b);
  doc.text(`${worksheet.title} Activity Area`, 105, y + 25, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
  doc.text("Print this worksheet for hands-on learning activities", 105, y + 37, { align: "center" });
  
  y += 70;
  
  // Subject-specific tips
  const tips = generateWorksheetTips(worksheet.subject, worksheet.ageRange);
  y = addSection(doc, "Tips for Success", [], y);
  y = addBulletPoints(doc, tips, y);
  
  // Page 3: Sample Exercises & Answer Guide
  doc.addPage();
  y = 20;
  
  // Sample Exercises
  y = addSection(doc, "Sample Exercises", [], y);
  const sampleExercises = generateWorksheetSampleExercises(worksheet.subject, worksheet.title, worksheet.ageRange);
  y = addBulletPoints(doc, sampleExercises, y);
  
  // Assessment Rubric
  y = addSection(doc, "Assessment Rubric", [], y);
  const rubric = generateWorksheetRubric(worksheet.ageRange);
  y = addBulletPoints(doc, rubric, y);
  
  // Page 4: Parent/Teacher Notes & Extensions
  doc.addPage();
  y = 20;
  
  // Parent/Teacher Notes
  y = addSection(doc, "Notes for Parents & Teachers", [], y);
  const parentNotes = generateWorksheetParentNotes(worksheet.subject, worksheet.ageRange);
  y = addBulletPoints(doc, parentNotes, y);
  
  // Extension Activities
  y = addSection(doc, "Extension Activities", [], y);
  const extensions = generateWorksheetExtensions(worksheet.subject, worksheet.title);
  y = addBulletPoints(doc, extensions, y);
  
  // Home Connection
  y = addSection(doc, "Home Connection Ideas", [], y);
  const homeConnection = [
    "Display completed worksheets on a family art wall or refrigerator",
    "Discuss what was learned during dinner conversation",
    "Find real-world examples that connect to the worksheet topic",
    "Create follow-up activities using household materials",
    "Read books related to the worksheet theme together"
  ];
  y = addBulletPoints(doc, homeConnection, y);
  
  addFooter(doc, 1, 4);
  
  return doc;
};

// New worksheet helper functions
const generateWorksheetSampleExercises = (subject: string, title: string, ageRange: string): string[] => {
  const exercises: string[] = [];
  const subjectLower = subject.toLowerCase();
  const titleLower = title.toLowerCase();
  
  exercises.push("Exercise 1: Warm-Up Activity");
  if (subjectLower === "math") {
    exercises.push("  - Start with simple number recognition or counting warm-up");
    exercises.push("  - Color sections as you solve each problem");
  } else if (subjectLower === "language arts") {
    exercises.push("  - Begin with letter or word tracing practice");
    exercises.push("  - Say each letter sound or word aloud while coloring");
  } else if (subjectLower === "science") {
    exercises.push("  - Observe the image and list 3 things you notice");
    exercises.push("  - Make a prediction about what you will learn");
  } else {
    exercises.push("  - Look at the entire worksheet before beginning");
    exercises.push("  - Identify the main topic and gather your materials");
  }
  
  exercises.push("Exercise 2: Main Activity");
  exercises.push("  - Complete the primary coloring activity with focus");
  exercises.push("  - Follow any specific instructions for color choices");
  exercises.push("  - Take your time with detailed areas");
  
  exercises.push("Exercise 3: Reflection");
  exercises.push("  - Write or draw something new you learned");
  exercises.push("  - Share your completed work with someone");
  
  return exercises;
};

const generateWorksheetRubric = (ageRange: string): string[] => {
  const rubric: string[] = [];
  
  rubric.push("Excellent (4 points):");
  rubric.push("  - Work is complete with careful attention to detail");
  rubric.push("  - Shows understanding of the learning objectives");
  
  rubric.push("Good (3 points):");
  rubric.push("  - Most work is complete with reasonable effort");
  rubric.push("  - Demonstrates basic understanding of concepts");
  
  rubric.push("Developing (2 points):");
  rubric.push("  - Partial completion with some understanding shown");
  rubric.push("  - May need additional support or practice");
  
  rubric.push("Beginning (1 point):");
  rubric.push("  - Limited completion; concept review needed");
  rubric.push("  - Requires one-on-one guidance");
  
  return rubric;
};

const generateWorksheetParentNotes = (subject: string, ageRange: string): string[] => {
  const notes: string[] = [];
  
  notes.push("This worksheet is designed to reinforce learning through creative coloring activities.");
  notes.push("Allow your child to work at their own pace without rushing.");
  notes.push("Encourage questions and discussion about the content.");
  
  if (ageRange.includes("Pre-K") || ageRange.includes("Kindergarten")) {
    notes.push("Younger children may need help reading instructions aloud.");
    notes.push("Focus on the process rather than perfection in coloring.");
  } else {
    notes.push("Encourage independent work while being available for questions.");
    notes.push("Discuss what was learned after completion.");
  }
  
  notes.push(`This ${subject.toLowerCase()} worksheet supports curriculum standards for this age group.`);
  
  return notes;
};

const generateWorksheetExtensions = (subject: string, title: string): string[] => {
  const extensions: string[] = [];
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower === "math") {
    extensions.push("Create your own math problems for a family member to solve");
    extensions.push("Find objects around the house that match the math concepts");
    extensions.push("Play a math-based board game or card game");
  } else if (subjectLower === "science") {
    extensions.push("Conduct a simple experiment related to the topic");
    extensions.push("Watch an age-appropriate documentary or video");
    extensions.push("Keep a nature journal with observations");
  } else if (subjectLower === "language arts") {
    extensions.push("Write a short story using vocabulary from the worksheet");
    extensions.push("Read a book related to the theme");
    extensions.push("Practice letter writing to a friend or family member");
  } else if (subjectLower === "social studies") {
    extensions.push("Research more about the topic online or at the library");
    extensions.push("Interview a family member about their experiences");
    extensions.push("Create a poster or presentation about what you learned");
  } else {
    extensions.push("Create original artwork inspired by the worksheet");
    extensions.push("Teach the concepts to a sibling or stuffed animal");
    extensions.push("Make a game that uses what you learned");
  }
  
  extensions.push("Start a collection related to the topic");
  
  return extensions;
};

// Worksheet helper functions
const generateWorksheetInstructions = (subject: string, title: string, ageRange: string): string[] => {
  const instructions = [
    `Print the "${title}" worksheet on standard letter-size paper`
  ];
  
  const subjectLower = subject.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (subjectLower === "math") {
    if (titleLower.includes("color by number")) {
      instructions.push("Have students solve each math problem before coloring");
      instructions.push("Use the color key to match answers with colors");
    } else if (titleLower.includes("counting") || titleLower.includes("numbers")) {
      instructions.push("Guide students to count objects and write numerals");
      instructions.push("Practice number sequence recognition");
    } else if (titleLower.includes("pattern")) {
      instructions.push("Identify the pattern before completing the sequence");
      instructions.push("Use different colors to highlight repeating elements");
    } else if (titleLower.includes("fraction")) {
      instructions.push("Color the correct portion to represent each fraction");
      instructions.push("Compare fractions by visual representation");
    } else if (titleLower.includes("time")) {
      instructions.push("Practice reading clock faces and writing times");
      instructions.push("Match analog and digital time representations");
    } else if (titleLower.includes("multiplication")) {
      instructions.push("Complete multiplication problems before coloring");
      instructions.push("Use the times table grid for reference");
    } else {
      instructions.push("Complete math exercises before coloring activities");
      instructions.push("Show work and check answers carefully");
    }
  } else if (subjectLower === "science") {
    if (titleLower.includes("life cycle")) {
      instructions.push("Label each stage of the life cycle correctly");
      instructions.push("Color stages in sequence order");
    } else if (titleLower.includes("body") || titleLower.includes("anatomy")) {
      instructions.push("Label body parts using the word bank provided");
      instructions.push("Use accurate colors for anatomical structures");
    } else if (titleLower.includes("weather")) {
      instructions.push("Match weather symbols to their descriptions");
      instructions.push("Color weather scenes appropriately");
    } else {
      instructions.push("Read the science facts before coloring each section");
      instructions.push("Use colors that match real-world observations");
    }
  } else if (subjectLower === "language arts") {
    if (titleLower.includes("alphabet")) {
      instructions.push("Trace letters carefully following directional arrows");
      instructions.push("Color the picture that starts with each letter sound");
    } else if (titleLower.includes("sight word")) {
      instructions.push("Read each sight word aloud before coloring");
      instructions.push("Practice writing words in the spaces provided");
    } else if (titleLower.includes("phonics") || titleLower.includes("rhyming")) {
      instructions.push("Identify letter sounds and blend patterns");
      instructions.push("Color rhyming word pairs with matching colors");
    } else {
      instructions.push("Read vocabulary words and their definitions");
      instructions.push("Complete writing activities in each section");
    }
  } else if (subjectLower === "social studies") {
    if (titleLower.includes("flag")) {
      instructions.push("Research flag colors before coloring accurately");
      instructions.push("Learn country names and capital cities");
    } else if (titleLower.includes("map") || titleLower.includes("state")) {
      instructions.push("Identify geographic features and boundaries");
      instructions.push("Label states, capitals, or landmarks as directed");
    } else {
      instructions.push("Discuss the cultural or historical significance");
      instructions.push("Color while learning about communities and places");
    }
  } else {
    instructions.push("Provide students with colored pencils, crayons, or markers");
    instructions.push("Read activity instructions with students before beginning");
  }
  
  if (ageRange.includes("Pre-K") || ageRange.includes("Kindergarten")) {
    instructions.push("Allow extra time for younger learners to complete activities");
    instructions.push("Provide hands-on guidance for tracing and fine motor tasks");
  } else {
    instructions.push("Encourage independent work while monitoring progress");
  }
  
  return instructions;
};

const generateWorksheetGoals = (subject: string, title: string): string[] => {
  const goals: string[] = [];
  const subjectLower = subject.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (subjectLower === "math") {
    if (titleLower.includes("counting") || titleLower.includes("numbers")) {
      goals.push("Master number recognition from 1-100");
      goals.push("Develop one-to-one correspondence counting skills");
    } else if (titleLower.includes("pattern")) {
      goals.push("Identify and extend AB, ABC, and complex patterns");
      goals.push("Create original patterns using learned concepts");
    } else if (titleLower.includes("shape") || titleLower.includes("geometry")) {
      goals.push("Recognize and name 2D and 3D shapes");
      goals.push("Understand shape properties like sides and angles");
    } else if (titleLower.includes("fraction")) {
      goals.push("Understand fraction concepts: parts of a whole");
      goals.push("Compare and order simple fractions");
    } else if (titleLower.includes("multiplication")) {
      goals.push("Memorize multiplication facts through 12");
      goals.push("Apply multiplication to real-world problems");
    } else {
      goals.push(`Build ${subject.toLowerCase()} fluency through practice`);
      goals.push("Develop problem-solving strategies");
    }
  } else if (subjectLower === "science") {
    if (titleLower.includes("ocean") || titleLower.includes("marine")) {
      goals.push("Identify marine animals and their habitats");
      goals.push("Understand ocean ecosystems and food chains");
    } else if (titleLower.includes("dinosaur")) {
      goals.push("Learn dinosaur names and characteristics");
      goals.push("Understand geological time periods");
    } else if (titleLower.includes("space") || titleLower.includes("planet")) {
      goals.push("Name and order planets in the solar system");
      goals.push("Understand basic astronomy concepts");
    } else if (titleLower.includes("life cycle") || titleLower.includes("butterfly")) {
      goals.push("Sequence life cycle stages correctly");
      goals.push("Understand metamorphosis and growth processes");
    } else if (titleLower.includes("plant")) {
      goals.push("Identify plant parts and their functions");
      goals.push("Understand photosynthesis and plant growth");
    } else {
      goals.push(`Develop scientific vocabulary related to ${title.toLowerCase()}`);
      goals.push("Practice observation and classification skills");
    }
  } else if (subjectLower === "language arts") {
    if (titleLower.includes("alphabet")) {
      goals.push("Recognize and write all 26 letters");
      goals.push("Associate letters with beginning sounds");
    } else if (titleLower.includes("sight word")) {
      goals.push("Read high-frequency words automatically");
      goals.push("Build reading fluency foundation");
    } else if (titleLower.includes("phonics")) {
      goals.push("Master letter-sound correspondence");
      goals.push("Blend sounds to read simple words");
    } else {
      goals.push("Expand vocabulary and reading comprehension");
      goals.push("Develop writing and communication skills");
    }
  } else {
    goals.push(`Master core ${subject.toLowerCase()} concepts through ${title.toLowerCase()}`);
    goals.push("Build subject-area vocabulary and understanding");
  }
  
  goals.push("Develop fine motor skills through coloring activities");
  goals.push("Practice focus, patience, and attention to detail");
  
  return goals;
};

const generateWorksheetActivities = (subject: string, title: string): string[] => {
  const activities: string[] = [];
  const subjectLower = subject.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (subjectLower === "math") {
    activities.push(`Complete ${title} calculation exercises`);
    if (titleLower.includes("color by")) {
      activities.push("Solve problems to reveal hidden pictures");
    }
    activities.push("Practice number writing and formation");
    activities.push("Connect math concepts with visual representations");
  } else if (subjectLower === "science") {
    activities.push(`Label and color ${title.toLowerCase()} diagrams`);
    activities.push("Match vocabulary terms with definitions");
    activities.push("Complete classification and sorting activities");
    activities.push("Draw and illustrate scientific concepts");
  } else if (subjectLower === "language arts") {
    activities.push(`Complete ${title} literacy exercises`);
    activities.push("Trace, write, and practice letter/word formation");
    activities.push("Match pictures with words and sounds");
    activities.push("Read and respond to comprehension prompts");
  } else if (subjectLower === "social studies") {
    activities.push(`Explore ${title} through coloring and labeling`);
    activities.push("Identify locations, symbols, and cultural elements");
    activities.push("Connect geography with visual learning");
  } else {
    activities.push(`Complete hands-on ${title} activities`);
    activities.push("Follow step-by-step instructions for each section");
    activities.push("Apply learning through creative coloring");
  }
  
  return activities;
};

const generateWorksheetTips = (subject: string, ageRange: string): string[] => {
  const tips: string[] = [];
  
  if (ageRange.includes("Pre-K") || ageRange.includes("Kindergarten") || ageRange.includes("3-") || ageRange.includes("4-") || ageRange.includes("5-")) {
    tips.push("Use chunky crayons or triangular pencils for easier grip");
    tips.push("Complete one section at a time to maintain focus");
    tips.push("Praise effort and progress, not just finished work");
    tips.push("Take movement breaks between activities");
  } else if (ageRange.includes("Elementary") || ageRange.includes("6-") || ageRange.includes("7-") || ageRange.includes("8-")) {
    tips.push("Set a timer for focused work periods");
    tips.push("Check work before moving to the next section");
    tips.push("Use the answer key for self-assessment");
    tips.push("Discuss completed work with a partner");
  } else {
    tips.push("Work independently and check answers carefully");
    tips.push("Use reference materials when needed");
    tips.push("Challenge yourself with extension activities");
    tips.push("Connect learning to real-world applications");
  }
  
  return tips;
};

export const generateResourceGuidePDF = (guide: ResourceGuideData): jsPDF => {
  const doc = new jsPDF();
  
  addHeader(doc, guide.title, "Educational Resource Guide");
  
  // Metadata box with cream/warm background
  doc.setFillColor(THEME.warmGray.r, THEME.warmGray.g, THEME.warmGray.b);
  doc.roundedRect(15, 50, 180, 25, 3, 3, "F");
  
  // Accent border
  doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 50, 180, 25, 3, 3);
  
  doc.setFontSize(10);
  doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
  doc.text(`Topics: ${guide.topics.join(", ")}`, 20, 60);
  doc.text(`Audience: ${guide.audience}`, 20, 68);
  
  let y = 85;
  
  // Overview - use actual description
  y = addSection(doc, `About "${guide.title}"`, [guide.description], y);
  
  // Topic-specific content
  y = addSection(doc, "Key Topics Covered", [], y);
  const topicDetails = generateTopicDetails(guide.topics, guide.title, guide.audience);
  y = addBulletPoints(doc, topicDetails, y);
  
  // Audience-specific best practices
  const bestPractices = generateBestPractices(guide.audience, guide.title, guide.topics);
  y = addSection(doc, "Best Practices", [], y);
  y = addBulletPoints(doc, bestPractices, y);
  
  // Page 2: Implementation Guide
  doc.addPage();
  y = 20;
  
  const implementation = generateImplementation(guide.title, guide.audience, guide.topics);
  y = addSection(doc, "Implementation Guide", [], y);
  y = addBulletPoints(doc, implementation, y);
  
  // Audience-specific resources
  const resources = generateResources(guide.audience, guide.title);
  y = addSection(doc, "Recommended Resources", [], y);
  y = addBulletPoints(doc, resources, y);
  
  // Page 3: Practical Examples & Activities
  doc.addPage();
  y = 20;
  
  // Weekly Schedule Example
  y = addSection(doc, "Sample Weekly Schedule", [], y);
  const weeklySchedule = generateWeeklySchedule(guide.audience, guide.topics);
  y = addBulletPoints(doc, weeklySchedule, y);
  
  // Activity Ideas
  y = addSection(doc, "Ready-to-Use Activity Ideas", [], y);
  const activityIdeas = generateActivityIdeas(guide.title, guide.audience);
  y = addBulletPoints(doc, activityIdeas, y);
  
  // Page 4: FAQ and Troubleshooting
  doc.addPage();
  y = 20;
  
  // FAQ specific to the guide topic
  y = addSection(doc, "Frequently Asked Questions", [], y);
  
  const faqs = generateFAQs(guide.title, guide.audience, guide.topics);
  faqs.forEach(faq => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
    doc.text(`Q: ${faq.question}`, 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(THEME.text.r, THEME.text.g, THEME.text.b);
    const answerLines = doc.splitTextToSize(`A: ${faq.answer}`, 170);
    answerLines.forEach((line: string) => {
      doc.text(line, 20, y);
      y += 6;
    });
    y += 8;
  });
  
  // Troubleshooting Section
  y = addSection(doc, "Common Challenges & Solutions", [], y);
  const troubleshooting = generateTroubleshooting(guide.audience);
  y = addBulletPoints(doc, troubleshooting, y);
  
  // Page 5: Checklists and Quick Reference
  doc.addPage();
  y = 20;
  
  // Quick Reference Checklist
  y = addSection(doc, "Quick Reference Checklist", [], y);
  const checklist = generateChecklist(guide.audience, guide.topics);
  y = addBulletPoints(doc, checklist, y);
  
  // Success Metrics
  y = addSection(doc, "Measuring Success", [], y);
  const metrics = generateSuccessMetrics(guide.audience);
  y = addBulletPoints(doc, metrics, y);
  
  // Notes Section with themed border
  doc.setDrawColor(THEME.primary.r, THEME.primary.g, THEME.primary.b);
  doc.setLineWidth(0.8);
  doc.roundedRect(20, y + 5, 170, 50, 3, 3);
  doc.setFontSize(9);
  doc.setTextColor(THEME.muted.r, THEME.muted.g, THEME.muted.b);
  doc.text("Notes:", 25, y + 15);
  
  addFooter(doc, 1, 5);
  
  return doc;
};

// New resource guide helper functions
const generateWeeklySchedule = (audience: string, topics: string[]): string[] => {
  const schedule: string[] = [];
  
  if (audience.includes("Teacher")) {
    schedule.push("Monday: Introduce new coloring theme with vocabulary preview");
    schedule.push("Tuesday: Guided coloring session with discussion questions");
    schedule.push("Wednesday: Independent coloring with learning journal entry");
    schedule.push("Thursday: Partner or group coloring activity");
    schedule.push("Friday: Gallery walk and reflection sharing");
  } else if (audience.includes("Parent")) {
    schedule.push("Morning: 10-15 minute coloring as calm start to the day");
    schedule.push("Afternoon: Educational coloring connected to daily learning");
    schedule.push("Evening: Relaxing coloring as part of bedtime routine");
    schedule.push("Weekend: Extended creative coloring projects");
  } else {
    schedule.push("Daily: Designate 15-30 minutes for focused coloring time");
    schedule.push("Weekly: Try a new theme or subject area each week");
    schedule.push("Monthly: Review completed work and celebrate progress");
  }
  
  return schedule;
};

const generateActivityIdeas = (title: string, audience: string): string[] => {
  const activities: string[] = [];
  
  activities.push("Activity 1: Color & Learn - Complete a page while discussing the topic");
  activities.push("Activity 2: Color Story - Create a narrative around the colored images");
  activities.push("Activity 3: Color Challenge - Use only primary/secondary/warm/cool colors");
  activities.push("Activity 4: Collaborative Coloring - Multiple people work on one large image");
  activities.push("Activity 5: Mindful Coloring - Focus on breathing while coloring slowly");
  activities.push("Activity 6: Color Journal - Document feelings and thoughts about each piece");
  
  if (audience.includes("Teacher")) {
    activities.push("Activity 7: Peer Teaching - Students explain their work to classmates");
  } else {
    activities.push("Activity 7: Display & Share - Create a rotating gallery at home");
  }
  
  return activities;
};

const generateTroubleshooting = (audience: string): string[] => {
  const issues: string[] = [];
  
  issues.push("Challenge: Child loses interest quickly");
  issues.push("  Solution: Try shorter sessions, different themes, or coloring together");
  
  issues.push("Challenge: Frustration with detailed designs");
  issues.push("  Solution: Start with simpler images and gradually increase complexity");
  
  issues.push("Challenge: Rushing through pages without care");
  issues.push("  Solution: Set quality goals, use timers, celebrate careful work");
  
  issues.push("Challenge: Running out of fresh activities");
  issues.push("  Solution: Rotate themes, try new materials, add creative challenges");
  
  return issues;
};

const generateChecklist = (audience: string, topics: string[]): string[] => {
  const checklist: string[] = [];
  
  checklist.push("[ ] Designated coloring space is set up and organized");
  checklist.push("[ ] Age-appropriate coloring materials are available");
  checklist.push("[ ] Coloring pages are printed and ready");
  checklist.push("[ ] Time is scheduled for coloring activities");
  checklist.push("[ ] Learning objectives are clear for each session");
  checklist.push("[ ] Display area is ready for completed work");
  checklist.push("[ ] Backup activities are prepared if needed");
  checklist.push("[ ] Progress tracking system is in place");
  
  return checklist;
};

const generateSuccessMetrics = (audience: string): string[] => {
  const metrics: string[] = [];
  
  metrics.push("Engagement: Child shows enthusiasm and asks to color");
  metrics.push("Focus: Attention span during coloring increases over time");
  metrics.push("Quality: Completed work shows increasing care and detail");
  metrics.push("Learning: Child can discuss what they learned from the activity");
  metrics.push("Creativity: Original ideas and color choices are expressed");
  metrics.push("Emotional: Coloring serves as effective calm-down strategy");
  
  if (audience.includes("Teacher")) {
    metrics.push("Academic: Connections to curriculum standards are evident");
    metrics.push("Social: Positive peer interactions during coloring time");
  }
  
  return metrics;
};

// Resource guide helper functions
const generateTopicDetails = (topics: string[], title: string, audience: string): string[] => {
  const details: string[] = [];
  const titleLower = title.toLowerCase();
  
  topics.forEach(topic => {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes("lesson") || topicLower.includes("planning")) {
      details.push(`${topic}: Create effective lesson plans that integrate coloring with curriculum standards`);
    } else if (topicLower.includes("assessment")) {
      details.push(`${topic}: Evaluate student progress and learning outcomes through creative activities`);
    } else if (topicLower.includes("differentiation")) {
      details.push(`${topic}: Adapt activities for diverse learning needs and ability levels`);
    } else if (topicLower.includes("motivation") || topicLower.includes("engagement")) {
      details.push(`${topic}: Keep learners excited and engaged with varied coloring approaches`);
    } else if (topicLower.includes("progress") || topicLower.includes("tracking")) {
      details.push(`${topic}: Monitor development and celebrate growth over time`);
    } else if (topicLower.includes("motor") || topicLower.includes("coordination")) {
      details.push(`${topic}: Build hand strength and control through targeted coloring exercises`);
    } else if (topicLower.includes("mindful") || topicLower.includes("relax")) {
      details.push(`${topic}: Use coloring for stress relief, calm, and emotional regulation`);
    } else if (topicLower.includes("craft") || topicLower.includes("creative")) {
      details.push(`${topic}: Extend coloring into hands-on art projects and creative expression`);
    } else if (topicLower.includes("teamwork") || topicLower.includes("cooperation")) {
      details.push(`${topic}: Foster collaboration through group coloring activities`);
    } else if (topicLower.includes("special") || topicLower.includes("access") || topicLower.includes("inclusion")) {
      details.push(`${topic}: Adapt activities for children with different learning needs`);
    } else if (topicLower.includes("home") || topicLower.includes("setup")) {
      details.push(`${topic}: Create an optimal learning environment for coloring activities`);
    } else if (topicLower.includes("travel") || topicLower.includes("portable")) {
      details.push(`${topic}: Take learning on the go with travel-friendly coloring activities`);
    } else if (topicLower.includes("screen") || topicLower.includes("offline")) {
      details.push(`${topic}: Engage children without digital devices through creative coloring`);
    } else if (topicLower.includes("sleep") || topicLower.includes("bedtime")) {
      details.push(`${topic}: Establish calming routines to prepare for restful sleep`);
    } else if (topicLower.includes("holiday") || topicLower.includes("seasonal")) {
      details.push(`${topic}: Celebrate special occasions with themed coloring activities`);
    } else {
      details.push(`${topic}: Comprehensive strategies and practical examples for ${titleLower}`);
    }
  });
  
  return details;
};

const generateBestPractices = (audience: string, title: string, topics: string[]): string[] => {
  const practices: string[] = [];
  const titleLower = title.toLowerCase();
  
  if (audience.includes("Teacher")) {
    practices.push("Integrate coloring activities with curriculum learning objectives");
    practices.push("Create organized supply stations for easy student access");
    practices.push("Use coloring as a transition activity or reward");
    practices.push("Document student progress through portfolio collections");
    if (titleLower.includes("special") || titleLower.includes("adaptation")) {
      practices.push("Modify activities based on IEP goals and accommodations");
    }
  } else if (audience.includes("Parent")) {
    practices.push("Create a dedicated, comfortable coloring space at home");
    practices.push("Join your child in coloring to model engagement");
    practices.push("Connect coloring topics to everyday conversations");
    practices.push("Display finished work to celebrate achievement");
    if (titleLower.includes("bedtime") || titleLower.includes("calm")) {
      practices.push("Establish a consistent timing routine before bed");
    }
  } else if (audience.includes("Famil")) {
    practices.push("Make coloring a regular family activity time");
    practices.push("Choose themes that interest all family members");
    practices.push("Create collaborative coloring projects together");
    practices.push("Use coloring during family travel and outings");
  }
  
  practices.push("Provide a variety of coloring tools for different preferences");
  practices.push("Celebrate effort and creativity, not just finished products");
  
  return practices;
};

const generateImplementation = (title: string, audience: string, topics: string[]): string[] => {
  const steps: string[] = [];
  const titleLower = title.toLowerCase();
  
  steps.push(`Step 1: Review the "${title}" guide thoroughly before beginning`);
  
  if (audience.includes("Teacher")) {
    steps.push("Step 2: Align activities with your curriculum standards and objectives");
    steps.push("Step 3: Prepare materials and organize your classroom space");
    steps.push("Step 4: Introduce activities with clear instructions and modeling");
    steps.push("Step 5: Monitor student engagement and provide support");
    steps.push("Step 6: Assess learning outcomes and adjust future activities");
  } else if (audience.includes("Parent")) {
    steps.push("Step 2: Set up a comfortable, well-lit coloring area at home");
    steps.push("Step 3: Gather appropriate materials based on your child's age");
    steps.push("Step 4: Introduce activities during calm, focused times");
    steps.push("Step 5: Participate alongside your child when possible");
    steps.push("Step 6: Track progress and celebrate achievements");
  } else {
    steps.push("Step 2: Choose activities appropriate for all participants");
    steps.push("Step 3: Schedule regular times for family coloring sessions");
    steps.push("Step 4: Create a positive, encouraging atmosphere");
    steps.push("Step 5: Share and discuss completed work together");
    steps.push("Step 6: Plan follow-up activities and creative extensions");
  }
  
  return steps;
};

const generateResources = (audience: string, title: string): string[] => {
  const resources: string[] = [];
  
  resources.push("Access our complete library of printable coloring pages");
  resources.push("Download matching lesson plans and worksheets");
  
  if (audience.includes("Teacher")) {
    resources.push("Join educator forums for sharing ideas and strategies");
    resources.push("Access professional development materials on creative learning");
    resources.push("Download assessment rubrics and progress tracking tools");
  } else if (audience.includes("Parent")) {
    resources.push("Subscribe to our parent newsletter for weekly activity ideas");
    resources.push("Join our online community of parents and caregivers");
    resources.push("Access age-specific activity recommendations");
  } else {
    resources.push("Browse family-friendly activity bundles");
    resources.push("Access seasonal and holiday-themed collections");
    resources.push("Connect with other families in our community");
  }
  
  resources.push("Contact our support team for personalized recommendations");
  
  return resources;
};

const generateFAQs = (title: string, audience: string, topics: string[]): {question: string, answer: string}[] => {
  const faqs: {question: string, answer: string}[] = [];
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes("classroom") || audience.includes("Teacher")) {
    faqs.push({
      question: "How do I integrate coloring into an already packed curriculum?",
      answer: "Use coloring as a reinforcement activity that supports existing lessons. A 10-15 minute coloring session can consolidate learning from any subject area."
    });
  }
  
  if (titleLower.includes("home") || audience.includes("Parent")) {
    faqs.push({
      question: "How much time should my child spend coloring each day?",
      answer: "15-30 minutes is ideal for most ages. Adjust based on your child's attention span and interest level."
    });
  }
  
  if (titleLower.includes("motor") || titleLower.includes("skill")) {
    faqs.push({
      question: "At what age should children start developing fine motor skills through coloring?",
      answer: "Children can begin with large crayons and simple shapes around age 2-3, progressing to more detailed work as coordination develops."
    });
  }
  
  if (titleLower.includes("mindful") || titleLower.includes("calm") || titleLower.includes("relax")) {
    faqs.push({
      question: "How does coloring help with stress and anxiety?",
      answer: "Coloring activates the brain's focus center while reducing amygdala activity, creating a meditative state that reduces stress hormones."
    });
  }
  
  // Always include a general FAQ
  faqs.push({
    question: "What coloring materials work best?",
    answer: "Colored pencils offer precision for detailed work. Crayons are great for younger children. Markers provide vibrant colors but may bleed through paper."
  });
  
  faqs.push({
    question: "How can I keep children motivated to continue coloring?",
    answer: "Offer variety in themes and difficulty levels, display completed work proudly, and participate alongside them to model engagement."
  });
  
  return faqs;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const viewPDF = (doc: jsPDF) => {
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
};
