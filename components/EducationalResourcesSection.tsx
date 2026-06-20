import { useState, useMemo } from "react";
import { Download, BookOpen, FileText, Users, Eye, GraduationCap, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  generateLessonPlanPDF, 
  generateWorksheetPDF, 
  generateResourceGuidePDF, 
  downloadPDF, 
  viewPDF 
} from "@/utils/pdfGenerator";

interface LessonPlan {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  schoolType: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  pages: number;
}

interface Worksheet {
  id: string;
  title: string;
  description: string;
  subject: string;
  ageRange: string;
  pages: number;
}

interface ResourceGuide {
  id: string;
  title: string;
  description: string;
  topics: string[];
  audience: string;
  pages: number;
}

const lessonPlans: LessonPlan[] = [
  { id: "lp1", title: "Animal Habitats & Adaptations", description: "Explore different animal habitats while developing fine motor skills through themed coloring activities.", subjects: ["Science", "Art"], schoolType: "Elementary (7-11 years)", duration: "45 minutes", difficulty: "Beginner", pages: 18 },
  { id: "lp2", title: "Numbers & Patterns Discovery", description: "Learn basic math concepts through pattern recognition and number coloring exercises.", subjects: ["Math", "Art"], schoolType: "Kindergarten (5-6 years)", duration: "30 minutes", difficulty: "Beginner", pages: 12 },
  { id: "lp3", title: "World Cultures Through Art", description: "Discover different cultures and traditions through culturally-inspired coloring pages and activities.", subjects: ["Social Studies", "Art"], schoolType: "Middle School (12-14 years)", duration: "60 minutes", difficulty: "Intermediate", pages: 24 },
  { id: "lp4", title: "Color Theory Fundamentals", description: "Complete curriculum introducing primary, secondary, and complementary colors through interactive coloring activities.", subjects: ["Art", "Science"], schoolType: "Elementary (7-11 years)", duration: "50 minutes", difficulty: "Beginner", pages: 20 },
  { id: "lp5", title: "Mandala Mindfulness & Focus", description: "8-week program using mandala coloring for relaxation, focus improvement, and emotional regulation.", subjects: ["Art", "Wellness"], schoolType: "Elementary (8-12 years)", duration: "40 minutes", difficulty: "Intermediate", pages: 32 },
  { id: "lp6", title: "Geometry Through Art", description: "Comprehensive unit teaching geometric shapes, angles, and spatial reasoning using structured coloring patterns.", subjects: ["Math", "Art"], schoolType: "Elementary (7-10 years)", duration: "55 minutes", difficulty: "Intermediate", pages: 22 },
  { id: "lp7", title: "Symmetry & Mathematical Balance", description: "Complete lesson series teaching symmetry concepts through butterfly wings, mandala designs, and mirror exercises.", subjects: ["Math", "Art"], schoolType: "Elementary (6-9 years)", duration: "35 minutes", difficulty: "Beginner", pages: 16 },
  { id: "lp8", title: "Four Seasons Art Curriculum", description: "Year-long curriculum with themed coloring projects, nature observations, and seasonal activities.", subjects: ["Science", "Art"], schoolType: "Elementary (5-11 years)", duration: "45 minutes", difficulty: "Beginner", pages: 48 },
  { id: "lp9", title: "Emotions & Feelings Through Art", description: "Social-emotional learning curriculum helping students express and understand emotions through color choices.", subjects: ["SEL", "Art"], schoolType: "Elementary (5-10 years)", duration: "40 minutes", difficulty: "Beginner", pages: 20 },
  { id: "lp10", title: "Science Illustration Workshop", description: "STEM-integrated program combining biology lessons with detailed coloring of cells, plants, and ecosystems.", subjects: ["Science", "Art"], schoolType: "Middle School (10-14 years)", duration: "60 minutes", difficulty: "Advanced", pages: 28 },
  { id: "lp11", title: "Art History Through Coloring", description: "Journey through art movements from Renaissance to Modern Art with famous artwork recreations.", subjects: ["Art", "History"], schoolType: "Middle School (11-16 years)", duration: "55 minutes", difficulty: "Advanced", pages: 30 },
  { id: "lp12", title: "Environmental Awareness Program", description: "Ecology-focused curriculum teaching conservation through rainforest, ocean, and wildlife coloring.", subjects: ["Science", "Art"], schoolType: "Elementary (7-12 years)", duration: "50 minutes", difficulty: "Intermediate", pages: 26 },
  { id: "lp13", title: "Creative Writing & Illustration", description: "Integrated literacy program combining story creation with character design and scene illustration.", subjects: ["Language Arts", "Art"], schoolType: "Elementary (8-13 years)", duration: "65 minutes", difficulty: "Intermediate", pages: 24 },
  { id: "lp14", title: "Mindful Morning Routines", description: "Daily 15-minute coloring activities designed to start the school day with calm focus and engagement.", subjects: ["Wellness", "Art"], schoolType: "Elementary (5-10 years)", duration: "15 minutes", difficulty: "Beginner", pages: 30 },
  { id: "lp15", title: "Music & Art Integration", description: "Cross-curricular program connecting musical concepts with visual art through rhythm patterns.", subjects: ["Music", "Art"], schoolType: "Elementary (6-11 years)", duration: "45 minutes", difficulty: "Beginner", pages: 18 },
  { id: "lp16", title: "Ancient Civilizations Art Study", description: "Historical exploration of Egyptian, Greek, Roman, and Mayan art through detailed coloring pages.", subjects: ["History", "Art"], schoolType: "Middle School (10-15 years)", duration: "60 minutes", difficulty: "Advanced", pages: 36 },
  { id: "lp17", title: "Botanical Illustration Course", description: "Detailed plant study combining botany lessons with scientific illustration techniques and journaling.", subjects: ["Science", "Art"], schoolType: "Middle School (9-14 years)", duration: "55 minutes", difficulty: "Advanced", pages: 28 },
  { id: "lp18", title: "Ocean Life Exploration", description: "Marine biology curriculum with detailed underwater scenes, sea creatures, and ecosystem education.", subjects: ["Science", "Art"], schoolType: "Elementary (6-10 years)", duration: "40 minutes", difficulty: "Beginner", pages: 22 },
  { id: "lp19", title: "Space & Astronomy Adventure", description: "Learn about planets, stars, galaxies, and space exploration through cosmic coloring activities.", subjects: ["Science", "Art"], schoolType: "Elementary (7-12 years)", duration: "50 minutes", difficulty: "Intermediate", pages: 24 },
  { id: "lp20", title: "Dinosaur Era Discovery", description: "Prehistoric learning journey with dinosaur species, geological periods, and paleontology basics.", subjects: ["Science", "History"], schoolType: "Elementary (5-9 years)", duration: "45 minutes", difficulty: "Beginner", pages: 20 },
  { id: "lp21", title: "Human Body Systems", description: "Anatomy education through organ systems, skeletal structure, and physiological processes coloring.", subjects: ["Science", "Health"], schoolType: "Middle School (10-14 years)", duration: "55 minutes", difficulty: "Advanced", pages: 32 },
  { id: "lp22", title: "Weather & Climate Patterns", description: "Meteorology basics with weather phenomena, climate zones, and atmospheric science activities.", subjects: ["Science", "Geography"], schoolType: "Elementary (7-11 years)", duration: "40 minutes", difficulty: "Intermediate", pages: 18 },
  { id: "lp23", title: "Insect & Bug World", description: "Entomology introduction with detailed insect anatomy, life cycles, and habitat exploration.", subjects: ["Science", "Art"], schoolType: "Elementary (5-9 years)", duration: "35 minutes", difficulty: "Beginner", pages: 16 },
  { id: "lp24", title: "Fairy Tales & Folklore", description: "Literature exploration through classic stories, character analysis, and creative storytelling.", subjects: ["Language Arts", "Art"], schoolType: "Elementary (6-10 years)", duration: "45 minutes", difficulty: "Beginner", pages: 22 },
  { id: "lp25", title: "Map Reading & Geography", description: "Geographic skills development with continents, countries, landmarks, and navigation basics.", subjects: ["Geography", "Social Studies"], schoolType: "Elementary (8-12 years)", duration: "50 minutes", difficulty: "Intermediate", pages: 26 },
  { id: "lp26", title: "Healthy Eating & Nutrition", description: "Food groups, balanced diet, and nutrition science through colorful food-themed activities.", subjects: ["Health", "Science"], schoolType: "Elementary (5-10 years)", duration: "35 minutes", difficulty: "Beginner", pages: 18 },
  { id: "lp27", title: "Community Helpers & Jobs", description: "Career exploration with various professions, community roles, and workplace environments.", subjects: ["Social Studies", "Art"], schoolType: "Kindergarten (4-7 years)", duration: "30 minutes", difficulty: "Beginner", pages: 20 },
  { id: "lp28", title: "Transportation Through Time", description: "History of vehicles from ancient to modern times with technological evolution themes.", subjects: ["History", "Science"], schoolType: "Elementary (6-10 years)", duration: "40 minutes", difficulty: "Beginner", pages: 22 },
  { id: "lp29", title: "Bird Watching & Ornithology", description: "Bird species identification, migration patterns, and avian biology through detailed illustrations.", subjects: ["Science", "Art"], schoolType: "Elementary (7-12 years)", duration: "45 minutes", difficulty: "Intermediate", pages: 24 },
  { id: "lp30", title: "Architecture & Building Design", description: "Structural concepts, famous buildings, and architectural styles from around the world.", subjects: ["Art", "Math"], schoolType: "Middle School (10-14 years)", duration: "55 minutes", difficulty: "Advanced", pages: 28 },
];

const worksheets: Worksheet[] = [
  { id: "ws1", title: "Alphabet Coloring & Tracing", description: "Practice letter recognition and formation with engaging animal-themed alphabet pages.", subject: "Language Arts", ageRange: "Pre-K (3-4 years)", pages: 26 },
  { id: "ws2", title: "Math Facts Color by Number", description: "Reinforce addition and subtraction facts through color-coded number activities.", subject: "Math", ageRange: "Elementary (7-11 years)", pages: 15 },
  { id: "ws3", title: "Science Vocabulary Builder", description: "Learn scientific terms and concepts with labeled diagram coloring activities.", subject: "Science", ageRange: "Middle School (12-14 years)", pages: 20 },
  { id: "ws4", title: "Pattern Recognition Fun", description: "Complete the patterns and color matching exercises for cognitive development.", subject: "Math", ageRange: "Pre-K (4-5 years)", pages: 18 },
  { id: "ws5", title: "Nature Discovery Pages", description: "Learn about animals and plants while coloring detailed nature scenes.", subject: "Science", ageRange: "Elementary (6-10 years)", pages: 24 },
  { id: "ws6", title: "Numbers 1-100 Counting", description: "Learn numbers through color-by-number activities and counting games.", subject: "Math", ageRange: "Kindergarten (5-6 years)", pages: 22 },
  { id: "ws7", title: "Ocean Life Explorer", description: "Discover marine animals with facts and detailed underwater scenes to color.", subject: "Science", ageRange: "Elementary (5-9 years)", pages: 20 },
  { id: "ws8", title: "Space & Planets Journey", description: "Color the solar system while learning about planets, stars, and astronauts.", subject: "Science", ageRange: "Elementary (6-11 years)", pages: 18 },
  { id: "ws9", title: "Dinosaur Discovery Pack", description: "Prehistoric creatures coloring pack with fun facts about each dinosaur species.", subject: "Science", ageRange: "Elementary (4-8 years)", pages: 16 },
  { id: "ws10", title: "World Flags Collection", description: "Learn geography by coloring flags from countries around the world.", subject: "Social Studies", ageRange: "Elementary (7-12 years)", pages: 30 },
  { id: "ws11", title: "Fairy Tale Characters", description: "Classic storybook characters to color with reading comprehension prompts.", subject: "Language Arts", ageRange: "Elementary (5-8 years)", pages: 14 },
  { id: "ws12", title: "Musical Instruments Gallery", description: "Learn about different instruments while coloring orchestra and band equipment.", subject: "Music", ageRange: "Elementary (6-10 years)", pages: 18 },
  { id: "ws13", title: "Shapes & Geometry Basics", description: "Identify and color geometric shapes with measurement activities included.", subject: "Math", ageRange: "Kindergarten (5-7 years)", pages: 20 },
  { id: "ws14", title: "Sight Words Practice", description: "Build reading fluency with illustrated sight word coloring pages.", subject: "Language Arts", ageRange: "Kindergarten (5-6 years)", pages: 26 },
  { id: "ws15", title: "Weather Symbols Learning", description: "Understand weather patterns and symbols through colorful meteorology pages.", subject: "Science", ageRange: "Elementary (6-9 years)", pages: 12 },
  { id: "ws16", title: "Telling Time Practice", description: "Learn to read analog and digital clocks with themed coloring activities.", subject: "Math", ageRange: "Elementary (6-8 years)", pages: 18 },
  { id: "ws17", title: "Fraction Fun", description: "Visual fraction concepts with pizza, pie, and shape-based coloring exercises.", subject: "Math", ageRange: "Elementary (8-11 years)", pages: 16 },
  { id: "ws18", title: "Plant Life Cycles", description: "Botanical education with seed-to-flower progression coloring activities.", subject: "Science", ageRange: "Elementary (6-10 years)", pages: 14 },
  { id: "ws19", title: "Emotion Expression Cards", description: "Social-emotional learning with facial expression and feeling identification.", subject: "SEL", ageRange: "Pre-K (3-6 years)", pages: 20 },
  { id: "ws20", title: "Money & Coins Recognition", description: "Financial literacy basics with currency identification coloring pages.", subject: "Math", ageRange: "Elementary (6-9 years)", pages: 16 },
  { id: "ws21", title: "Body Parts Labeling", description: "Human anatomy introduction with body part identification and coloring.", subject: "Science", ageRange: "Kindergarten (4-6 years)", pages: 18 },
  { id: "ws22", title: "Opposites & Antonyms", description: "Vocabulary building with illustrated opposite concept coloring pages.", subject: "Language Arts", ageRange: "Pre-K (4-6 years)", pages: 22 },
  { id: "ws23", title: "Community Places", description: "Neighborhood exploration with buildings, parks, and public spaces to color.", subject: "Social Studies", ageRange: "Kindergarten (5-7 years)", pages: 16 },
  { id: "ws24", title: "Multiplication Tables", description: "Times tables practice with color-coded multiplication grid activities.", subject: "Math", ageRange: "Elementary (8-11 years)", pages: 20 },
  { id: "ws25", title: "Butterfly Life Cycle", description: "Metamorphosis stages from caterpillar to butterfly with detailed illustrations.", subject: "Science", ageRange: "Elementary (5-9 years)", pages: 12 },
  { id: "ws26", title: "Rhyming Words Practice", description: "Phonemic awareness development with rhyming word pair coloring activities.", subject: "Language Arts", ageRange: "Pre-K (4-6 years)", pages: 24 },
  { id: "ws27", title: "Healthy Foods Sorting", description: "Nutrition education with food group identification and coloring.", subject: "Health", ageRange: "Kindergarten (4-7 years)", pages: 18 },
  { id: "ws28", title: "Simple Machines", description: "Physics concepts with lever, pulley, and wheel illustrations to color.", subject: "Science", ageRange: "Elementary (8-12 years)", pages: 16 },
  { id: "ws29", title: "US States & Capitals", description: "Geography learning with state outlines and capital city identification.", subject: "Social Studies", ageRange: "Elementary (8-12 years)", pages: 25 },
  { id: "ws30", title: "Phonics Blend Practice", description: "Letter blend recognition with illustrated word family coloring pages.", subject: "Language Arts", ageRange: "Kindergarten (5-7 years)", pages: 22 },
];

const resourceGuides: ResourceGuide[] = [
  { id: "rg1", title: "Classroom Integration Strategies", description: "Best practices for incorporating coloring activities into daily lesson plans and curriculum standards.", topics: ["Lesson Planning", "Assessment", "Differentiation"], audience: "For Teachers", pages: 24 },
  { id: "rg2", title: "Home Learning Support Guide", description: "Tips for parents to create engaging learning environments and support educational goals at home.", topics: ["Home Setup", "Motivation", "Progress Tracking"], audience: "For Parents", pages: 18 },
  { id: "rg3", title: "Travel Education Activities", description: "Portable learning activities and educational games for maintaining learning on the go.", topics: ["Portable Activities", "Screen-Free Games", "Travel Tips"], audience: "For Families", pages: 16 },
  { id: "rg4", title: "Screen-Free Weekend Ideas", description: "Creative coloring activities and family bonding projects without digital devices.", topics: ["Offline Activities", "Family Bonding", "Creative Play"], audience: "For Parents", pages: 14 },
  { id: "rg5", title: "Rainy Day Activity Bundle", description: "Indoor coloring activities, games, and creative projects for when outdoor play isn't an option.", topics: ["Indoor Activities", "Games", "Crafts"], audience: "For Families", pages: 20 },
  { id: "rg6", title: "Bedtime Calming Routine", description: "Relaxing coloring activities designed to help children wind down before sleep.", topics: ["Relaxation", "Sleep Routine", "Mindfulness"], audience: "For Parents", pages: 12 },
  { id: "rg7", title: "Sibling Bonding Activities", description: "Collaborative coloring projects designed for brothers and sisters to work together creatively.", topics: ["Teamwork", "Sharing", "Cooperation"], audience: "For Families", pages: 16 },
  { id: "rg8", title: "Fine Motor Skills Development", description: "Age-appropriate coloring exercises to strengthen hand coordination, grip, and pencil control.", topics: ["Motor Skills", "Hand Strength", "Coordination"], audience: "For Teachers", pages: 22 },
  { id: "rg9", title: "Holiday Craft Companion", description: "Seasonal coloring activities with craft ideas for family celebrations throughout the year.", topics: ["Seasonal Crafts", "Holiday Themes", "Decorations"], audience: "For Families", pages: 28 },
  { id: "rg10", title: "Classroom Management Tips", description: "Best practices for organizing coloring materials, stations, and creative time in educational settings.", topics: ["Organization", "Time Management", "Supplies"], audience: "For Teachers", pages: 18 },
  { id: "rg11", title: "Special Needs Adaptation Guide", description: "Strategies for adapting coloring activities for children with different learning needs and abilities.", topics: ["Accessibility", "Modifications", "Inclusion"], audience: "For Teachers", pages: 26 },
  { id: "rg12", title: "Art Supply Buying Guide", description: "Complete guide to choosing age-appropriate coloring materials, from crayons to professional pencils.", topics: ["Supplies", "Quality", "Budget"], audience: "For Parents", pages: 14 },
  { id: "rg13", title: "Homeschool Art Curriculum", description: "Week-by-week art education plan for homeschooling families with skill progression tracking.", topics: ["Curriculum", "Scheduling", "Assessment"], audience: "For Parents", pages: 32 },
  { id: "rg14", title: "Therapeutic Coloring Benefits", description: "Research-backed guide on using coloring for anxiety relief, focus improvement, and emotional wellness.", topics: ["Mental Health", "Stress Relief", "Research"], audience: "For Teachers", pages: 20 },
  { id: "rg15", title: "Group Activity Organizer", description: "Planning guide for coloring parties, classroom events, and community art sessions.", topics: ["Event Planning", "Group Activities", "Materials"], audience: "For Teachers", pages: 16 },
  { id: "rg16", title: "Digital vs Traditional Coloring", description: "Comprehensive comparison of digital apps and traditional coloring with recommendations for each age.", topics: ["Technology", "Comparison", "Best Practices"], audience: "For Parents", pages: 18 },
  { id: "rg17", title: "Early Childhood Development", description: "How coloring supports cognitive, emotional, and physical development in young children.", topics: ["Development", "Milestones", "Research"], audience: "For Teachers", pages: 24 },
  { id: "rg18", title: "Color Psychology Guide", description: "Understanding how colors affect mood, behavior, and learning in educational settings.", topics: ["Psychology", "Color Theory", "Application"], audience: "For Teachers", pages: 16 },
  { id: "rg19", title: "Parent-Teacher Communication", description: "Strategies for discussing art-based learning progress and home-school collaboration.", topics: ["Communication", "Progress Reports", "Collaboration"], audience: "For Teachers", pages: 14 },
  { id: "rg20", title: "Summer Learning Activities", description: "Preventing summer learning loss with engaging coloring activities and educational games.", topics: ["Summer Programs", "Skill Retention", "Fun Learning"], audience: "For Parents", pages: 22 },
  { id: "rg21", title: "Gifted & Advanced Learners", description: "Challenging coloring activities and extensions for advanced students seeking more complexity.", topics: ["Enrichment", "Challenge", "Extensions"], audience: "For Teachers", pages: 20 },
  { id: "rg22", title: "Cultural Sensitivity in Art", description: "Guidelines for respectfully incorporating diverse cultural art styles in educational settings.", topics: ["Diversity", "Respect", "Education"], audience: "For Teachers", pages: 18 },
  { id: "rg23", title: "Assessment Through Art", description: "Using coloring activities to assess understanding, creativity, and skill development.", topics: ["Assessment", "Rubrics", "Evaluation"], audience: "For Teachers", pages: 22 },
  { id: "rg24", title: "Creating Art Stations", description: "Setting up effective coloring and art stations in classrooms and home environments.", topics: ["Setup", "Organization", "Materials"], audience: "For Teachers", pages: 16 },
  { id: "rg25", title: "Mindfulness & Meditation", description: "Combining coloring with breathing exercises and meditation for enhanced calm and focus.", topics: ["Mindfulness", "Breathing", "Calm"], audience: "For Families", pages: 14 },
  { id: "rg26", title: "Building Creative Confidence", description: "Encouraging artistic expression and overcoming fear of making mistakes in creative activities.", topics: ["Confidence", "Expression", "Growth"], audience: "For Parents", pages: 18 },
  { id: "rg27", title: "Multi-Age Group Activities", description: "Coloring projects that work for mixed age groups in family or classroom settings.", topics: ["Mixed Ages", "Adaptation", "Inclusion"], audience: "For Families", pages: 16 },
  { id: "rg28", title: "Art History for Kids", description: "Age-appropriate introduction to famous artists and art movements through coloring.", topics: ["Art History", "Artists", "Movements"], audience: "For Teachers", pages: 24 },
  { id: "rg29", title: "Celebrating Student Work", description: "Ideas for displaying, sharing, and celebrating children's coloring accomplishments.", topics: ["Display", "Celebration", "Motivation"], audience: "For Teachers", pages: 12 },
  { id: "rg30", title: "Nature-Based Learning", description: "Outdoor coloring activities and nature observation journaling techniques.", topics: ["Outdoors", "Nature", "Observation"], audience: "For Families", pages: 20 },
];

function LessonPlanCard({ lesson }: { lesson: LessonPlan }) {
  const doc = useMemo(() => generateLessonPlanPDF({
    title: lesson.title,
    description: lesson.description,
    subjects: lesson.subjects,
    schoolType: lesson.schoolType,
    duration: lesson.duration,
    difficulty: lesson.difficulty,
    pages: lesson.pages,
  }), [lesson]);
  const pageCount = doc.getNumberOfPages();

  const handleDownload = () => {
    downloadPDF(doc, `${lesson.title.replace(/\s+/g, '-').toLowerCase()}-lesson-plan.pdf`);
    toast.success(`Downloading "${lesson.title}" PDF...`, {
      description: "Your download has started."
    });
  };

  const handleView = () => {
    viewPDF(doc);
    toast.info(`Opening "${lesson.title}" preview...`, {
      description: "Preview opened in new tab."
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <Badge 
            variant="outline" 
            className={`text-xs ${
              lesson.difficulty === "Beginner" ? "text-emerald-600 border-emerald-600" :
              lesson.difficulty === "Intermediate" ? "text-amber-600 border-amber-600" :
              "text-rose-600 border-rose-600"
            }`}
          >
            {lesson.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">
          {lesson.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {lesson.subjects.map((subject) => (
            <Badge key={subject} variant="secondary" className="text-xs font-normal">
              {subject}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            {lesson.schoolType}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {lesson.duration}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-3"
            onClick={handleView}
            aria-label={`Preview ${lesson.title} lesson plan PDF`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorksheetCard({ worksheet }: { worksheet: Worksheet }) {
  const doc = useMemo(() => generateWorksheetPDF({
    title: worksheet.title,
    description: worksheet.description,
    subject: worksheet.subject,
    ageRange: worksheet.ageRange,
    pages: worksheet.pages,
  }), [worksheet]);
  const pageCount = doc.getNumberOfPages();

  const handleDownload = () => {
    downloadPDF(doc, `${worksheet.title.replace(/\s+/g, '-').toLowerCase()}-worksheet.pdf`);
    toast.success(`Downloading "${worksheet.title}" PDF...`, {
      description: "Your download has started."
    });
  };

  const handleView = () => {
    viewPDF(doc);
    toast.info(`Opening "${worksheet.title}" preview...`, {
      description: "Preview opened in new tab."
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{pageCount} pages</span>
        </div>
        <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">
          {worksheet.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">{worksheet.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Badge variant="secondary" className="text-xs font-normal">
          {worksheet.subject}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" />
          {worksheet.ageRange}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-3"
            onClick={handleView}
            aria-label={`Preview ${worksheet.title} worksheet PDF`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceGuideCard({ guide }: { guide: ResourceGuide }) {
  const doc = useMemo(() => generateResourceGuidePDF({
    title: guide.title,
    description: guide.description,
    topics: guide.topics,
    audience: guide.audience,
    pages: guide.pages,
  }), [guide]);
  const pageCount = doc.getNumberOfPages();

  const handleDownload = () => {
    downloadPDF(doc, `${guide.title.replace(/\s+/g, '-').toLowerCase()}-guide.pdf`);
    toast.success(`Downloading "${guide.title}" PDF...`, {
      description: "Your download has started."
    });
  };

  const handleView = () => {
    viewPDF(doc);
    toast.info(`Opening "${guide.title}" preview...`, {
      description: "Preview opened in new tab."
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{pageCount} pages</span>
        </div>
        <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">
          {guide.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">{guide.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {guide.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs font-normal">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" />
          {guide.audience}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-3"
            onClick={handleView}
            aria-label={`Preview ${guide.title} resource guide PDF`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EducationalResourcesSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessonPlans = lessonPlans.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    lesson.schoolType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorksheets = worksheets.filter((worksheet) =>
    worksheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worksheet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worksheet.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worksheet.ageRange.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = resourceGuides.filter((guide) =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    guide.audience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="resources" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12" data-reveal>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-5 py-2 rounded-full mb-6">
            <GraduationCap className="h-5 w-5" />
            <span className="text-base font-semibold tracking-wide uppercase">Educational Resources</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
            Learning Made{" "}
            <span className="text-primary">Creative & Fun</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Curated lesson plans, printable worksheets, and resource guides designed for 
            classrooms, home use, and on-the-go activities.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources by title, subject, or age..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lesson-plans" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="lesson-plans">Comprehensive Lesson Plans</TabsTrigger>
            <TabsTrigger value="worksheets">Printable Worksheets</TabsTrigger>
            <TabsTrigger value="guides">Educational Resource Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="lesson-plans">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Comprehensive Lesson Plans</h3>
              <p className="text-muted-foreground">Structured educational content with learning objectives, activities, and assessment tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessonPlans.map((lesson) => (
                <LessonPlanCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
            {filteredLessonPlans.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No lesson plans found matching your search.</p>
            )}
          </TabsContent>

          <TabsContent value="worksheets">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Printable Worksheets</h3>
              <p className="text-muted-foreground">Ready-to-print educational worksheets that combine learning with creative expression</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorksheets.map((worksheet) => (
                <WorksheetCard key={worksheet.id} worksheet={worksheet} />
              ))}
            </div>
            {filteredWorksheets.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No worksheets found matching your search.</p>
            )}
          </TabsContent>

          <TabsContent value="guides">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Educational Resource Guides</h3>
              <p className="text-muted-foreground">Comprehensive guides with tips, strategies, and best practices for educators and parents</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <ResourceGuideCard key={guide.id} guide={guide} />
              ))}
            </div>
            {filteredGuides.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No resource guides found matching your search.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
