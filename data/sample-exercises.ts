// Extensive sample exercise data for German learning app

export const extensiveSampleExercises = {
    // ==================================
    // Vocabulary Exercises (Wortschatz)
    // ==================================
    vocabulary: [
      // --- Fill in the blanks ---
      {
        id: "vocab-fill-1",
        type: "fill-blanks",
        question: "Fill in the missing words about daily routines",
        text: "Ich ___ um 7 Uhr auf. Dann ___ ich meine Zähne und ___ mich an. Zum Frühstück ___ ich Müsli.",
        blanks: [
          { id: "vfb1-1", answer: "stehe", position: 0, hint: "wake/stand up (verb)" },
          { id: "vfb1-2", answer: "putze", position: 1, hint: "clean (verb)" },
          { id: "vfb1-3", answer: "ziehe", position: 2, hint: "get dressed (verb)" },
          { id: "vfb1-4", answer: "esse", position: 3, hint: "eat (verb)" }
        ],
        explanation: "Common verbs for describing a morning routine."
      },
      {
        id: "vocab-fill-2",
        type: "fill-blanks",
        question: "Fill in the missing nouns related to food",
        text: "Im Supermarkt kaufe ich ___, ___, ___ und ___.",
        blanks: [
          { id: "vfb2-1", answer: "Brot", position: 0, hint: "bread" },
          { id: "vfb2-2", answer: "Milch", position: 1, hint: "milk" },
          { id: "vfb2-3", answer: "Käse", position: 2, hint: "cheese" },
          { id: "vfb2-4", answer: "Obst", position: 3, hint: "fruit" }
        ],
        explanation: "Basic grocery items. Remember the articles when using them elsewhere!"
      },
      // --- Matching ---
      {
        id: "vocab-match-1",
        type: "matching",
        question: "Match the German animals with their English translations",
        pairs: [
          { id: "vmat1-1", left: "die Katze", right: "cat" },
          { id: "vmat1-2", left: "der Hund", right: "dog" },
          { id: "vmat1-3", left: "der Vogel", right: "bird" },
          { id: "vmat1-4", left: "der Fisch", right: "fish" },
          { id: "vmat1-5", left: "die Maus", right: "mouse" }
        ],
        explanation: "Common animal names in German with their definite articles."
      },
      {
        id: "vocab-match-2",
        type: "matching",
        question: "Match the adjectives with their opposites (antonyms)",
        pairs: [
          { id: "vmat2-1", left: "groß", right: "klein" },
          { id: "vmat2-2", left: "schnell", right: "langsam" },
          { id: "vmat2-3", left: "heiß", right: "kalt" },
          { id: "vmat2-4", left: "neu", right: "alt" },
          { id: "vmat2-5", left: "gut", right: "schlecht" }
        ],
        explanation: "Understanding opposites helps expand vocabulary quickly."
      },
      // --- Multiple choice ---
      {
        id: "vocab-mc-1",
        type: "multiple-choice",
        question: "Was bedeutet 'das Fenster'?",
        options: ["door", "window", "table", "chair"],
        correctAnswer: "window",
        explanation: "'Das Fenster' is the German word for 'window'. It is a neuter noun."
      },
      {
        id: "vocab-mc-2",
        type: "multiple-choice",
        question: "Which word is a synonym for 'sprechen'?",
        options: ["lesen", "schreiben", "reden", "hören"],
        correctAnswer: "reden",
        explanation: "'Sprechen' and 'reden' both mean 'to speak' or 'to talk'. 'Lesen' is 'to read', 'schreiben' is 'to write', 'hören' is 'to hear/listen'."
      },
      // --- True or false ---
      {
        id: "vocab-tf-1",
        type: "true-false",
        question: "'Der Tisch' means 'the chair' in German.",
        correctAnswer: false,
        explanation: "'Der Tisch' means 'the table'. 'The chair' is 'der Stuhl'."
      },
      {
        id: "vocab-tf-2",
        type: "true-false",
        question: "'Kaufen' means 'to sell'.",
        correctAnswer: false,
        explanation: "'Kaufen' means 'to buy'. 'To sell' is 'verkaufen'."
      },
      // --- Word search ---
      {
        id: "vocab-ws-1",
        type: "word-search",
        question: "Find the German words for numbers 1-5 in the grid",
        grid: [ // Example Grid - Needs actual generation logic in app
          ["X", "E", "I", "N", "S", "Y"],
          ["Z", "W", "E", "I", "Q", "R"],
          ["A", "B", "D", "R", "E", "I"],
          ["V", "I", "E", "R", "T", "U"],
          ["F", "Ü", "N", "F", "W", "X"],
          ["G", "H", "I", "J", "K", "L"]
        ],
        words: ["EINS", "ZWEI", "DREI", "VIER", "FUENF"], // Note: Ü often becomes UE in grids/caps
        explanation: "Find the numbers one (eins), two (zwei), three (drei), four (vier), and five (fünf)."
      },
      // --- Crossword puzzles (Data Structure Example) ---
      {
        id: "vocab-cross-1",
        type: "crossword", // Needs visual component
        question: "Solve the crossword puzzle with German family members",
        clues: [
          { id: "vcrs1-1", number: 1, direction: "across", clue: "Mother", answer: "MUTTER" },
          { id: "vcrs1-2", number: 2, direction: "across", clue: "Brother", answer: "BRUDER" },
          { id: "vcrs1-3", number: 1, direction: "down", clue: "Father", answer: "VATER" },
          { id: "vcrs1-4", number: 3, direction: "down", clue: "Sister", answer: "SCHWESTER" }
          // ... more clues
        ],
        // Grid structure representation would be needed here for actual display
        explanation: "Fill in the grid with common German family member terms."
      },
      // --- Definitions (Requires Free Response Input) ---
      {
        id: "vocab-def-1",
        type: "free-response", // Or a specific 'definition' type
        question: "Write a short definition for the German word 'arbeiten'.",
        // Correct answer/evaluation would involve checking for keywords like 'work', 'job', 'tätig sein' etc.
        explanation: "'Arbeiten' means 'to work'. A good definition mentions performing tasks, often for pay."
      },
      // --- Synonyms/Antonyms (Can be MC or Free Response) ---
       {
        id: "vocab-syn-1",
        type: "multiple-choice",
        question: "Choose a synonym for 'glücklich'.",
        options: ["traurig", "müde", "froh", "krank"],
        correctAnswer: "froh",
        explanation: "'Glücklich' means 'happy'. 'Froh' also means 'happy' or 'glad'. 'Traurig' is sad, 'müde' is tired, 'krank' is sick."
      },
       {
        id: "vocab-ant-1",
        type: "free-response", // Or multiple choice
        question: "What is an antonym (opposite) of 'laut'?",
        // Correct answer could be 'leise'
        explanation: "'Laut' means 'loud'. The opposite is 'leise' (quiet)."
      },
      // --- Sentence completion ---
      {
        id: "vocab-sentcomp-1",
        type: "fill-blanks", // Often similar to fill-blanks but focuses on using specific vocab
        question: "Complete the sentence using the word 'interessant'.",
        text: "Ich finde dieses Buch sehr ___.",
        blanks: [
          { id: "vsc1-1", answer: "interessant", position: 0, hint: "interesting" }
        ],
        explanation: "Use the adjective 'interessant' to describe the book."
      },
      // --- Using new words in sentences (Requires Free Response) ---
      {
        id: "vocab-usesent-1",
        type: "free-response", // Or specific 'sentence-writing' type
        question: "Write a complete German sentence using the word 'lernen'.",
        // Evaluation requires checking grammatical correctness and usage of 'lernen'.
        explanation: "Example: 'Ich lerne Deutsch.' or 'Wir lernen zusammen.' Make sure the verb is conjugated correctly."
      },
      // --- Word formation ---
      {
        id: "vocab-form-1",
        type: "multiple-choice",
        question: "Which noun can be formed from the verb 'fahren' (to drive/travel)?",
        options: ["der Fahrer", "die Fahrung", "das Gefahren", "die Fahrerin"],
        correctAnswer: "der Fahrer", // Die Fahrerin is also correct (female driver) - maybe list both or adjust Q
        explanation: "'Der Fahrer' means 'the driver' (male). 'Die Fahrerin' is the female driver. Nouns can often be formed from verbs."
      },
       {
        id: "vocab-form-2",
        type: "multiple-choice",
        question: "Adding the prefix 'un-' to 'freundlich' (friendly) makes it:",
        options: ["extra friendly", "unfriendly", "somewhat friendly", "friendship"],
        correctAnswer: "unfriendly",
        explanation: "The prefix 'un-' often negates the meaning of an adjective, similar to English 'un-'."
      },
      // --- Translation (word level) ---
      {
        id: "vocab-trans-1",
        type: "multiple-choice", // Or free response text input
        question: "How do you say 'water' in German?",
        options: ["die Milch", "der Saft", "das Wasser", "der Tee"],
        correctAnswer: "das Wasser",
        explanation: "'das Wasser' is water. 'die Milch' is milk, 'der Saft' is juice, 'der Tee' is tea."
      },
      {
        id: "vocab-trans-2",
        type: "free-response",
        question: "Translate the German word 'schreiben' into English.",
        // Correct Answer: to write
        explanation: "'schreiben' is the German verb for 'to write'."
      },
      // --- Sentence writing ---
      {
        id: "vocab-write-1",
        type: "free-response",
        question: "Write a sentence using the verb 'kochen' (to cook) and a food item.",
        // Example answers: "Ich koche Suppe", "Meine Mutter kocht Kartoffeln"
        explanation: "Practice using the verb 'kochen' with different subjects and food items."
      },
      // --- Word order practice ---
      {
        id: "vocab-order-1",
        type: "ordering",
        question: "Put the words in the correct order to form a sentence about hobbies:",
        words: ["gerne", "Fußball", "spiele", "ich", "am Wochenende"],
        correctOrder: ["ich", "spiele", "gerne", "Fußball", "am Wochenende"],
        explanation: "Basic word order: Subject + Verb + Adverb + Object + Time expression"
      },
      // --- Contextual vocabulary ---
      {
        id: "vocab-context-1",
        type: "multiple-choice",
        question: "Which word best completes the sentence: 'Im Restaurant ___ ich eine Pizza.'?",
        options: ["esse", "trinke", "kaufe", "lese"],
        correctAnswer: "esse",
        explanation: "'Essen' (to eat) is the most appropriate verb for ordering food in a restaurant."
      }
    ],
  
    // ==================================
    // Grammar Exercises (Grammatik)
    // ==================================
    grammar: [
      // --- Fill in the blanks ---
      {
        id: "gram-fill-1",
        type: "fill-blanks",
        question: "Complete with the correct definite article (der, die, das)",
        text: "Hier ist ___ Buch. Dort steht ___ Stuhl. Ich sehe ___ Frau.",
        blanks: [
          { id: "gfb1-1", answer: "das", position: 0, hint: "neuter" },
          { id: "gfb1-2", answer: "der", position: 1, hint: "masculine" },
          { id: "gfb1-3", answer: "die", position: 2, hint: "feminine" }
        ],
        explanation: "Nouns in German have grammatical genders: masculine (der), feminine (die), neuter (das)."
      },
      {
        id: "gram-fill-2",
        type: "fill-blanks",
        question: "Complete with the correct form of 'haben' (to have) in present tense.",
        text: "Ich ___ Hunger. Du ___ Durst. Er ___ ein Auto.",
        blanks: [
          { id: "gfb2-1", answer: "habe", position: 0, hint: "1st person singular" },
          { id: "gfb2-2", answer: "hast", position: 1, hint: "2nd person singular" },
          { id: "gfb2-3", answer: "hat", position: 2, hint: "3rd person singular" }
        ],
        explanation: "The verb 'haben' is irregular and frequently used."
      },
      {
        id: "gram-fill-3",
        type: "fill-blanks",
        question: "Complete with the correct prepositions (in, an, auf).",
        text: "Das Buch liegt ___ dem Tisch. Das Bild hängt ___ der Wand. Wir sind ___ der Schule.",
        blanks: [
          { id: "gfb3-1", answer: "auf", position: 0, hint: "on (horizontal surface)" },
          { id: "gfb3-2", answer: "an", position: 1, hint: "on (vertical surface)" },
          { id: "gfb3-3", answer: "in", position: 2, hint: "in/at (location)" }
        ],
        explanation: "Prepositions like 'in', 'an', 'auf' indicate location and often depend on the context and the following noun's case."
      },
      // --- Sentence transformation ---
      {
        id: "gram-trans-1",
        type: "free-response", // Requires text input and complex evaluation
        question: "Rewrite the sentence in the Perfekt tense: 'Ich lerne Deutsch.'",
        // Correct Answer: Ich habe Deutsch gelernt.
        explanation: "The Perfekt tense is used for completed actions, especially in spoken German. It's often formed with 'haben' or 'sein' + past participle."
      },
      {
        id: "gram-trans-2",
        type: "free-response",
        question: "Change the sentence to passive voice: 'Der Lehrer erklärt die Regel.'",
        // Correct Answer: Die Regel wird vom Lehrer erklärt.
        explanation: "In the passive voice, the object of the active sentence becomes the subject. Use 'werden' + past participle."
      },
      // --- Combining sentences ---
      {
        id: "gram-comb-1",
        type: "multiple-choice", // Or free response
        question: "Combine the sentences using 'weil' (because): 'Ich bleibe zu Hause. Ich bin krank.'",
        options: [
          "Ich bleibe zu Hause, aber ich bin krank.",
          "Ich bleibe zu Hause, weil ich krank bin.",
          "Ich bleibe zu Hause, obwohl ich krank bin.",
          "Ich bin krank, deshalb bleibe ich zu Hause."
        ],
        correctAnswer: "Ich bleibe zu Hause, weil ich krank bin.",
        explanation: "'Weil' introduces a subordinate clause explaining the reason. The verb goes to the end of the 'weil' clause."
      },
      // --- Separating sentences ---
      {
          id: "gram-sep-1",
          type: "free-response", // Complex evaluation
          question: "Separate the complex sentence into two simpler sentences: 'Obwohl das Wetter schlecht war, gingen wir spazieren.'",
          // Correct Answer: Das Wetter war schlecht. Trotzdem gingen wir spazieren. (Or similar logical separation)
          explanation: "Break down the sentence based on the main idea and the concession ('obwohl' - although). You might need connecting words like 'trotzdem' (nevertheless)."
      },
      // --- Identifying grammatical errors ---
      {
        id: "gram-ident-1",
        type: "multiple-choice", // Click on the wrong word or choose from options
        question: "Identify the grammatical error in the sentence: 'Er gebt mir das Buch.'",
        options: ["Er", "gebt", "mir", "das Buch"],
        correctAnswer: "gebt",
        explanation: "The verb 'geben' (to give) is irregular. The correct 3rd person singular form is 'gibt', not 'gebt'."
      },
      // --- Correcting grammatical errors ---
      {
        id: "gram-corr-1",
        type: "free-response",
        question: "Correct the error in the sentence: 'Ich habe nach Hause gegangen.'",
        // Correct Answer: Ich bin nach Hause gegangen.
        explanation: "Movement verbs like 'gehen' (to go) form the Perfekt tense with 'sein', not 'haben'."
      },
      // --- Ordering words to form sentences ---
      {
        id: "gram-order-1",
        type: "ordering", // Needs drag-and-drop or similar UI
        question: "Put the words in the correct order to form a sentence:",
        words: ["gern", "Musik", "Ich", "höre"],
        correctOrder: ["Ich", "höre", "gern", "Musik"], // Or "Musik höre ich gern."
        explanation: "Basic German sentence structure is Subject-Verb-Object (SVO). Adverbs like 'gern' often follow the verb."
      },
       {
        id: "gram-order-2",
        type: "ordering",
        question: "Put the words in the correct order to form a question:",
        words: ["du", "hast", "Was", "gemacht", "gestern"],
        correctOrder: ["Was", "hast", "du", "gestern", "gemacht"],
        explanation: "For W-questions (Was, Wo, Wann...), the question word comes first, followed by the conjugated verb, then the subject."
      },
      // --- Conjugation/Declension practice ---
      {
        id: "gram-conj-1",
        type: "fill-blanks", // Table-like format
        question: "Conjugate the verb 'wohnen' (to live/reside) in the present tense:",
        text: "ich ___\ndu ___\ner/sie/es ___\nwir ___\nihr ___\nsie/Sie ___",
        blanks: [
          { id: "gc1-1", answer: "wohne", position: 0 },
          { id: "gc1-2", answer: "wohnst", position: 1 },
          { id: "gc1-3", answer: "wohnt", position: 2 },
          { id: "gc1-4", answer: "wohnen", position: 3 },
          { id: "gc1-5", answer: "wohnt", position: 4 },
          { id: "gc1-6", answer: "wohnen", position: 5 }
        ],
        explanation: "'wohnen' is a regular verb. Note the endings: -e, -st, -t, -en, -t, -en."
      },
      {
        id: "gram-decl-1",
        type: "fill-blanks",
        question: "Decline 'der Tisch' (the table) in the singular:",
        text: "Nominativ: der Tisch\nGenitiv: ___ Tisches\nDativ: ___ Tisch\nAkkusativ: ___ Tisch",
         blanks: [
          { id: "gd1-1", answer: "des", position: 0, hint: "Genitive article" },
          { id: "gd1-2", answer: "dem", position: 1, hint: "Dative article" },
          { id: "gd1-3", answer: "den", position: 2, hint: "Accusative article" }
        ],
        explanation: "Masculine nouns change their definite article in the genitive (des), dative (dem), and accusative (den) cases. The noun itself often adds '-s' or '-es' in the genitive."
      },
      // --- Rewriting sentences with specific grammatical structures ---
      {
          id: "gram-rewrite-1",
          type: "free-response",
          question: "Rewrite the sentence using a relative clause: 'Das ist der Mann. Ich habe den Mann gestern gesehen.'",
          // Correct Answer: Das ist der Mann, den ich gestern gesehen habe.
          explanation: "Combine the sentences using a relative pronoun ('den' for the masculine accusative object) and moving the verb of the relative clause to the end."
      },
      // --- Matching sentence halves ---
      {
        id: "gram-matchhalf-1",
        type: "matching",
        question: "Match the sentence beginnings with the correct endings.",
        pairs: [
          { id: "gmh1-1", left: "Ich lerne Deutsch,", right: "weil ich in Deutschland arbeiten möchte." },
          { id: "gmh1-2", left: "Er geht nicht ins Kino,", right: "obwohl er eine Karte hat." },
          { id: "gmh1-3", left: "Wenn das Wetter schön ist,", right: "gehen wir spazieren." },
          { id: "gmh1-4", left: "Sie ist müde,", right: "deshalb geht sie schlafen." }
        ],
        explanation: "Connecting sentence parts correctly requires understanding conjunctions (weil, obwohl, wenn, deshalb) and word order rules."
      },
      // ... Add more grammar exercises across these types (aim for 20+ total)
    ],
  
    // ==================================
    // Reading Comprehension (Leseverstehen)
    // ==================================
    reading: [
      // --- Sample Text for RC exercises ---
      // (In a real app, this text might be displayed alongside the questions)
      /*
        const readingText1 = `
        **Ein Tag in Berlin**
        Anna wohnt in Berlin. Heute ist Samstag und sie hat frei. Am Morgen geht sie zum Bäcker und kauft frische Brötchen. Danach trifft sie ihre Freundin Lena in einem Café. Sie trinken Kaffee und essen Kuchen. Am Nachmittag besuchen sie das Brandenburger Tor. Es ist sehr beeindruckend. Viele Touristen machen Fotos. Am Abend gehen Anna und Lena ins Kino. Sie sehen einen lustigen Film. Es war ein schöner Tag.
        `;
      */
      // --- Multiple choice questions ---
      {
        id: "read-mc-1",
        type: "multiple-choice",
        question: "(Text: Ein Tag in Berlin) Was kauft Anna am Morgen?",
        // textSource: readingText1 // Reference to the text
        options: ["Kuchen", "Kaffee", "Brötchen", "Tickets"],
        correctAnswer: "Brötchen",
        explanation: "The text says: 'Am Morgen geht sie zum Bäcker und kauft frische Brötchen.'"
      },
      {
        id: "read-mc-2",
        type: "multiple-choice",
        question: "(Text: Ein Tag in Berlin) Wen trifft Anna im Café?",
        // textSource: readingText1
        options: ["Ihre Mutter", "Ihren Bruder", "Ihren Freund", "Ihre Freundin Lena"],
        correctAnswer: "Ihre Freundin Lena",
        explanation: "The text states: 'Danach trifft sie ihre Freundin Lena in einem Café.'"
      },
      // --- True or false statements ---
      {
        id: "read-tf-1",
        type: "true-false",
        question: "(Text: Ein Tag in Berlin) Anna und Lena besuchen das Museum.",
        // textSource: readingText1
        correctAnswer: false,
        explanation: "The text says they visit the Brandenburger Tor, not a museum."
      },
       {
        id: "read-tf-2",
        type: "true-false",
        question: "(Text: Ein Tag in Berlin) Der Film im Kino war traurig.",
        // textSource: readingText1
        correctAnswer: false,
        explanation: "The text mentions they saw a 'lustigen Film' (funny film)."
      },
      // --- Answering open-ended questions (Requires Free Response) ---
      {
        id: "read-open-1",
        type: "free-response",
        question: "(Text: Ein Tag in Berlin) Was machen Anna und Lena am Nachmittag?",
        // textSource: readingText1
        // Correct Answer: Sie besuchen das Brandenburger Tor.
        explanation: "Look for the part of the text describing the afternoon activities."
      },
      // --- Summarizing the text (Requires Free Response) ---
      {
        id: "read-summ-1",
        type: "free-response",
        question: "(Text: Ein Tag in Berlin) Summarize Anna's Saturday in one or two sentences.",
        // textSource: readingText1
        // Example Answer: Anna spent her Saturday buying bread, meeting a friend for coffee, sightseeing at the Brandenburg Gate, and going to the cinema.
        explanation: "Identify the main activities Anna did throughout the day."
      },
      // --- Identifying the main idea ---
      {
        id: "read-mainidea-1",
        type: "multiple-choice",
        question: "(Text: Ein Tag in Berlin) What is the main idea of the text?",
        // textSource: readingText1
        options: [
          "How to bake German bread",
          "A description of Anna's enjoyable Saturday in Berlin",
          "The history of the Brandenburg Gate",
          "A review of a new café in Berlin"
        ],
        correctAnswer: "A description of Anna's enjoyable Saturday in Berlin",
        explanation: "The text follows Anna through various activities on her day off."
      },
      // --- Identifying specific information ---
      {
        id: "read-specinfo-1",
        type: "multiple-choice", // Or fill-blank
        question: "(Text: Ein Tag in Berlin) What did Anna and Lena drink at the café?",
        // textSource: readingText1
        options: ["Tee", "Saft", "Wasser", "Kaffee"],
        correctAnswer: "Kaffee",
        explanation: "The text explicitly mentions: 'Sie trinken Kaffee...'"
      },
      // --- Inferencing ---
      {
        id: "read-infer-1",
        type: "multiple-choice",
        question: "(Text: Ein Tag in Berlin) Why were there many tourists at the Brandenburger Tor?",
        // textSource: readingText1
        options: [
          "Because it was free entry",
          "Because Anna invited them",
          "Because it is a famous and impressive landmark",
          "Because there was a special event"
          ],
        correctAnswer: "Because it is a famous and impressive landmark",
        explanation: "The text calls the gate 'sehr beeindruckend' (very impressive) and notes tourists taking photos, implying it's a significant attraction."
      },
      // --- Matching headings to paragraphs (Requires longer text broken into paragraphs) ---
      {
        id: "read-matchhead-1",
        type: "matching", // Needs UI for matching
        question: "Match the headings to the paragraphs (Imagine Text 2 divided into P1, P2, P3)",
        // textSource: text2 (A longer text about, e.g., German school system)
        headings: [
          { id: "head1", text: "Types of Secondary Schools"},
          { id: "head2", text: "The Role of Kindergarten"},
          { id: "head3", text: "Grundschule: The Foundation"}
        ],
        paragraphs: [ // Representing the paragraphs to be matched
           { id: "para1", text: "Paragraph 1 content..." },
           { id: "para2", text: "Paragraph 2 content..." },
           { id: "para3", text: "Paragraph 3 content..." }
        ],
        // correctMatches: { para1: "head2", para2: "head3", para3: "head1" } // Example answer structure
        explanation: "Read each paragraph and choose the heading that best summarizes its content."
      },
      // --- Ordering paragraphs (Requires jumbled paragraphs of a coherent text) ---
       {
        id: "read-orderpara-1",
        type: "ordering", // Needs UI
        question: "Put these paragraphs about making coffee in the correct order.",
        // textSource: text3 (jumbled paragraphs)
        paragraphs: [
           { id: "jpara1", text: "Dann gießt man heißes Wasser über das Pulver.", order: 2 },
           { id: "jpara2", text: "Zuerst mahlt man die Kaffeebohnen.", order: 1 },
           { id: "jpara3", text: "Zum Schluss kann man Milch oder Zucker hinzufügen.", order: 4 },
           { id: "jpara4", text: "Man wartet einige Minuten, bis der Kaffee fertig ist.", order: 3 }
        ],
        // correctOrderIds: ["jpara2", "jpara1", "jpara4", "jpara3"]
        explanation: "Arrange the paragraphs logically to describe the process of making coffee."
      },
      // --- Gap-fill exercises (based on a text) ---
      {
        id: "read-gapfill-1",
        type: "fill-blanks",
        question: "(Text: Ein Tag in Berlin) Fill in the gaps based on the text:",
        // textSource: readingText1
        text: "Anna trifft ihre Freundin Lena in einem ___. Am Nachmittag ___ sie das Brandenburger Tor. Am Abend sehen sie einen ___ Film.",
        blanks: [
          { id: "rgf1-1", answer: "Café", position: 0 },
          { id: "rgf1-2", answer: "besuchen", position: 1 },
          { id: "rgf1-3", answer: "lustigen", position: 2 }
        ],
        explanation: "Recall or find the missing words from the original 'Ein Tag in Berlin' text."
      },
      // ... Add more reading exercises with different texts (emails, news, stories)
    ],
  
    // ==================================
    // Writing Exercises (Schreiben)
    // ==================================
    // Note: Most writing exercises require free-response input and manual/AI grading.
    writing: [
      // --- Sentence writing ---
      {
        id: "write-sent-1",
        type: "free-response",
        question: "Write a German sentence describing what you ate for breakfast today.",
        // Example answer: Ich habe heute Morgen Müsli gegessen.
        explanation: "Use the Perfekt tense for past actions. Remember vocabulary for food."
      },
      {
        id: "write-sent-2",
        type: "free-response",
        question: "Write a German sentence about your favorite hobby using the verb 'mögen' (to like).",
        // Example answer: Ich mag Lesen. / Ich mag es, Musik zu hören.
        explanation: "'mögen' is often followed by a noun or 'es + zu + infinitive'."
      },
      // --- Paragraph writing ---
      {
        id: "write-para-1",
        type: "free-response",
        question: "Write a short paragraph (3-5 sentences) in German describing your best friend.",
        // Example answer structure: Mein bester Freund heißt [Name]. Er/Sie ist [age] Jahre alt. Er/Sie ist [adjective, e.g., nett, lustig]. Wir [activity, e.g., spielen oft Fußball] zusammen.
        explanation: "Include name, age, some characteristics, and perhaps a shared activity. Use correct verb conjugations and adjective endings if applicable."
      },
      // --- Essay writing (Prompt) ---
      {
        id: "write-essay-1",
        type: "free-response", // Marked as 'essay'
        question: "Write a short essay (approx. 100 words) in German on the topic: 'Why is learning German important for you?'",
        explanation: "Structure your essay with a brief introduction, reasons in the body, and a concluding sentence. Use connecting words."
      },
      // --- Letter/Email writing ---
       {
        id: "write-email-1",
        type: "free-response",
        question: "Write a short, informal email in German to a friend inviting them to your birthday party next Saturday. Include the time and place.",
        explanation: "Use informal greetings (Liebe/r [Name], Hallo [Name]), state the reason (invitation), provide details (Datum, Uhrzeit, Ort), and use an informal closing (Viele Grüße, Dein/e [Your Name])."
      },
      // --- Dialogue writing ---
      {
        id: "write-dialogue-1",
        type: "free-response",
        question: "Write a short dialogue (4-6 lines) in German between a customer and a baker.",
        // Example: Kunde: Guten Tag, ich hätte gern zwei Brötchen. Bäcker: Gerne. Sonst noch etwas? Kunde: Nein, danke. Was kostet das? Bäcker: Das macht 1 Euro 20, bitte.
        explanation: "Use typical phrases for buying/selling and politeness (bitte, danke)."
      },
      // --- Descriptive writing ---
      {
        id: "write-desc-1",
        type: "free-response",
        question: "Describe your favorite season (Jahreszeit) in German in 3-4 sentences. Mention the weather and typical activities.",
        explanation: "Use adjectives for weather (sonnig, kalt, warm, regnerisch) and verbs for activities (schwimmen, Ski fahren, spazieren gehen)."
      },
      // --- Narrative writing ---
      {
        id: "write-narr-1",
        type: "free-response",
        question: "Write a short story (4-6 sentences) in German about a funny experience you had while learning a language. Use the past tense (Perfekt or Präteritum).",
        explanation: "Focus on sequencing events (zuerst, dann, danach, schließlich) and use past tense verbs correctly."
      },
      // --- Creating lists ---
      {
        id: "write-list-1",
        type: "free-response", // Can be structured with bullet points
        question: "List 5 items you would pack for a summer holiday in Germany.",
        // Example answer: Sonnencreme, T-Shirts, kurze Hosen, Badesachen, ein Buch
        explanation: "Think about typical summer items. Remember to use German nouns."
      },
      // --- Filling out forms ---
      {
        id: "write-form-1",
        type: "fill-blanks", // Simulating a form
        question: "Fill out this simple registration form.",
        text: "Anmeldeformular\n\nVorname: ___(1)\nNachname: ___(2)\nGeburtsdatum: ___(3) (TT.MM.JJJJ)\nStraße & Hausnummer: ___(4)\nPostleitzahl & Ort: ___(5)\n",
        blanks: [
          { id: "wf1-1", answer: "", position: 0, hint: "First Name" },
          { id: "wf1-2", answer: "", position: 1, hint: "Last Name" },
          { id: "wf1-3", answer: "", position: 2, hint: "Date of Birth (DD.MM.YYYY)" },
          { id: "wf1-4", answer: "", position: 3, hint: "Street & House Number" },
          { id: "wf1-5", answer: "", position: 4, hint: "Postal Code & City" }
        ],
        explanation: "Practice providing personal information in the standard German format."
      },
      // --- Translation (paragraph/text level) ---
      {
        id: "write-trans-1",
        type: "free-response",
        question: "Translate the following short text into German: 'My name is Alex. I live in London. I am learning German because I want to study in Germany. It is an interesting language.'",
        explanation: "Pay attention to sentence structure, verb conjugation, articles, and word choice."
      },
      // ... Add more writing prompts covering different scenarios
    ],
  
    // ==================================
    // Listening Comprehension (Hörverstehen)
    // ==================================
    // Note: These require associated audio files. Placeholders like `audioSrc` are used.
    listening: [
      // --- Multiple choice questions ---
      {
        id: "listen-mc-1",
        type: "multiple-choice",
        question: "Listen to the announcement. Where is this announcement likely being made?",
        // audioSrc: "path/to/announcement.mp3" // Audio: Bahnhofsdurchsage (train station announcement)
        options: ["Airport", "Train Station", "Supermarket", "School"],
        correctAnswer: "Train Station",
        explanation: "Listen for keywords like 'Gleis' (platform), 'Zug' (train), 'Abfahrt' (departure), 'Verspätung' (delay)."
      },
      // --- True or false statements ---
      {
        id: "listen-tf-1",
        type: "true-false",
        question: "Listen to the weather report. True or False: It will rain tomorrow.",
        // audioSrc: "path/to/weather.mp3" // Audio: Short weather forecast
        correctAnswer: true, // Example answer based on hypothetical audio
        explanation: "Listen carefully for predictions about precipitation ('Regen', 'regnen')."
      },
      // --- Filling in missing information (in a transcript) ---
      {
        id: "listen-fill-1",
        type: "fill-blanks",
        question: "Listen to the dialogue and fill in the missing words.",
        // audioSrc: "path/to/dialogue_ordering_food.mp3"
        text: "Kellner: Guten Tag! Was ___ Sie bestellen?\nGast: Ich hätte gern ___ Schnitzel mit Pommes.\nKellner: Und zu ___?\nGast: Ein ___ bitte.",
        blanks: [
          { id: "lf1-1", answer: "möchten", position: 0, hint: "would like (polite)" },
          { id: "lf1-2", answer: "das", position: 1, hint: "the (neuter article)" },
          { id: "lf1-3", answer: "trinken", position: 2, hint: "to drink" },
          { id: "lf1-4", answer: "Wasser", position: 3, hint: "water" }
        ],
        explanation: "Listen closely to capture the exact words used in the conversation."
      },
      // --- Ordering events ---
      {
        id: "listen-order-1",
        type: "ordering", // Needs UI
        question: "Listen to the description of someone's morning routine. Put the actions in the correct order.",
        // audioSrc: "path/to/morning_routine.mp3"
        events: [ // Text of the events to be ordered
           { id: "lev1-A", text: "Frühstück essen", order: 3 },
           { id: "lev1-B", text: "Aufwachen", order: 1 },
           { id: "lev1-C", text: "Zur Arbeit fahren", order: 4 },
           { id: "lev1-D", text: "Duschen", order: 2 }
        ],
        // correctOrderIds: ["lev1-B", "lev1-D", "lev1-A", "lev1-C"]
        explanation: "Follow the sequence of actions described in the audio recording."
      },
      // --- Answering open-ended questions (Requires Free Response) ---
      {
        id: "listen-open-1",
        type: "free-response",
        question: "Listen to the phone call. Why is Maria calling Thomas?",
        // audioSrc: "path/to/phone_call_maria_thomas.mp3"
        // Example Answer based on audio: Sie ruft an, um zu fragen, ob er am Wochenende Zeit hat.
        explanation: "Understand the main purpose or reason for the conversation."
      },
      // --- Summarizing the audio (Requires Free Response) ---
      {
        id: "listen-summ-1",
        type: "free-response",
        question: "Listen to the short news report. Summarize the main topic in one sentence.",
        // audioSrc: "path/to/short_news.mp3"
        explanation: "Identify the central theme or event discussed in the news snippet."
      },
      // --- Note-taking (Requires Free Response, Hard to Auto-Grade) ---
       {
        id: "listen-notes-1",
        type: "free-response", // Or a dedicated 'note-taking' interface
        question: "Listen to the short lecture about Berlin's history. Take notes on 3 key historical facts mentioned.",
        // audioSrc: "path/to/berlin_history_lecture.mp3"
        explanation: "Practice active listening and identifying important information points."
      },
      // --- Gap-fill exercises (based on audio) ---
      {
        id: "listen-gapfill-1",
        type: "fill-blanks",
        question: "Listen to the audio about hobbies and fill in the gaps.",
        // audioSrc: "path/to/hobbies_audio.mp3"
        text: "Mein Lieblingshobby ist ___. Ich spiele gern ___ mit Freunden. Am Wochenende gehe ich oft ___.",
        blanks: [
          { id: "lgf1-1", answer: "Lesen", position: 0, hint: "Reading" }, // Example answers
          { id: "lgf1-2", answer: "Fußball", position: 1, hint: "Soccer" },
          { id: "lgf1-3", answer: "wandern", position: 2, hint: "hiking" }
        ],
        explanation: "Fill in the missing words based on what you hear in the audio recording about hobbies."
      },
      // ... Add more listening exercises with diverse audio sources (conversations, announcements, reports)
    ],
  
    // ==================================
    // Speaking Exercises (Sprechen)
    // ==================================
    // Note: These require audio recording and likely manual/AI evaluation.
    speaking: [
      // --- Role-playing ---
      {
        id: "speak-roleplay-1",
        type: "speaking-prompt", // Requires audio recording input
        question: "Role-play: You are at the tourist information office in Munich. Ask for a city map and information about museums. Record your questions.",
        // Example expected phrases: "Guten Tag. Haben Sie einen Stadtplan? Können Sie mir Informationen über Museen geben?"
        explanation: "Practice asking for information politely in a common tourist scenario."
      },
      // --- Discussions (Prompt) ---
       {
        id: "speak-discuss-1",
        type: "speaking-prompt",
        question: "Record yourself talking for 30-60 seconds about the advantages and disadvantages of using public transport.",
        explanation: "Structure your thoughts (e.g., Vorteile: ..., Nachteile: ...) and express your opinion."
      },
      // --- Interviews (Prompt) ---
      {
        id: "speak-interview-1",
        type: "speaking-prompt",
        question: "Imagine you are in a simple job interview. Record your answer to the question: 'Stellen Sie sich bitte kurz vor.' (Please introduce yourself briefly).",
        explanation: "Include your name, where you are from, maybe your profession or studies, and why you are interested (briefly)."
      },
      // --- Presentations (Prompt) ---
      {
        id: "speak-present-1",
        type: "speaking-prompt",
        question: "Prepare and record a short presentation (about 1 minute) introducing your hometown.",
        explanation: "Mention the name, location, maybe size, and one or two interesting things about it."
      },
      // --- Storytelling (Prompt) ---
       {
        id: "speak-story-1",
        type: "speaking-prompt",
        question: "Record yourself telling a very short story (3-5 sentences) about your last weekend using the Perfekt tense.",
        explanation: "Focus on using past tense correctly and sequencing events simply."
      },
      // --- Describing pictures ---
       {
        id: "speak-describe-1",
        type: "speaking-prompt",
        question: "Look at the picture (imagine a picture of a family eating dinner). Describe what you see. Record your description (3-5 sentences).",
        // imageSrc: "path/to/family_dinner.jpg" // Reference to the image
        explanation: "Use vocabulary for people, food, furniture, and actions (essen, sitzen, sprechen). Use present tense."
      },
      // --- Comparing and contrasting ---
      {
        id: "speak-compare-1",
        type: "speaking-prompt",
        question: "Compare living in the city (Stadt) and living in the countryside (Land). Mention one advantage for each. Record your answer.",
        explanation: "Use comparative phrases if possible (z.B., 'In der Stadt ist es lauter, aber auf dem Land ist es ruhiger.')"
      },
      // --- Giving instructions ---
      {
        id: "speak-instruct-1",
        type: "speaking-prompt",
        question: "Record yourself giving simple instructions on how to make a cup of tea (Tee kochen).",
        explanation: "Use imperative mood (Koch Wasser! Gib den Teebeutel in die Tasse! Gieß das Wasser auf!) or infinitive constructions."
      },
      // ... Add more speaking prompts for various situations
    ],
  
    // ==================================
    // Integrated Skills Exercises
    // ==================================
    integrated: [
      // --- Dictation ---
      {
        id: "integ-dict-1",
        type: "dictation", // Requires audio + text input comparison
        question: "Listen to the sentence and write it down exactly.",
        // audioSrc: "path/to/dictation_sentence_1.mp3" // Audio: "Morgen fahre ich nach Hamburg."
        correctAnswer: "Morgen fahre ich nach Hamburg.",
        explanation: "Pay attention to spelling, capitalization (nouns!), and word order."
      },
      // --- Translation (Text Level - similar to Writing/Translation) ---
      {
        id: "integ-trans-1",
        type: "free-response",
        question: "Translate this short email into English:\n\nLiebe Frau Müller,\n\nvielen Dank für Ihre schnelle Antwort. Der Termin am Dienstag um 10 Uhr passt gut.\n\nMit freundlichen Grüßen,\nPeter Schmidt",
        explanation: "Translate formal German email conventions into appropriate English."
      },
      // --- Gap-fill exercises (based on reading or listening) ---
      {
          id: "integ-gapfill-read-1",
          type: "fill-blanks", // Combines Reading + Vocab/Grammar
          question: "Read the text about hobbies, then fill the gaps in the summary: (Text provided separately) 'Markus' Hobbys sind ___ und ___. Er spielt nicht gern ___.'",
          // requires a short text about Markus' hobbies (e.g., likes reading, swimming, dislikes football)
          blanks: [
             { id: "igfr1-1", answer: "Lesen", position: 0 }, // Based on text
             { id: "igfr1-2", answer: "Schwimmen", position: 1 },
             { id: "igfr1-3", answer: "Fußball", position: 2 }
          ],
          explanation: "Read the source text carefully to find the information needed to complete the summary."
      },
       {
          id: "integ-gapfill-listen-1",
          type: "fill-blanks", // Combines Listening + Vocab/Grammar
          question: "Listen to the dialogue about weekend plans, then fill the gaps: 'Anna möchte am Samstag ___. Thomas schlägt vor, ___ zu gehen.'",
          // audioSrc: "path/to/weekend_plans_dialogue.mp3"
          blanks: [
             { id: "igfl1-1", answer: "ins Kino gehen", position: 0 }, // Based on audio
             { id: "igfl1-2", answer: "wandern", position: 1 }
          ],
          explanation: "Listen for the specific plans mentioned by Anna and Thomas in the audio."
      },
      // --- Writing a response to a reading or listening passage ---
      {
        id: "integ-response-read-1",
        type: "free-response", // Combines Reading + Writing
        question: "Read this short opinion piece about recycling (Text provided separately). Write 2-3 sentences in German stating whether you agree or disagree and why.",
        explanation: "First, understand the main point of the text. Then formulate your own opinion using phrases like 'Ich stimme zu, weil...' (I agree because...) or 'Ich stimme nicht zu, weil...' (I disagree because...)."
      },
      {
        id: "integ-response-listen-1",
        type: "free-response", // Combines Listening + Writing
        question: "Listen to the short interview about traveling (Audio provided). Write a short response (2-3 sentences) in German about your own favorite way to travel and why.",
        // audioSrc: "path/to/travel_interview.mp3"
        explanation: "Listen to the interview for context, then express your personal preference using 'Ich reise am liebsten mit [Transportmittel], weil...'."
      },
      // ... Add more integrated exercises combining different skills
    ]
  };
  
  // Helper function remains the same as provided
  export function getSampleExercises(exerciseTypes: string[], count: number = 5) {
    const allExercises = Object.values(extensiveSampleExercises).flat();
    const filteredExercises = allExercises.filter(exercise =>
      exerciseTypes.includes(exercise.type)
    );
    if (filteredExercises.length === 0) {
      // If filtering by SPECIFIC sub-type yields nothing, maybe broaden search or return all?
      // Let's return from all available if specific type isn't found directly
      // Re-filter based on broader category if type is specific like 'fill-blanks' vs 'vocab-fill' ?
      // For now, returning subset of all if filter fails.
       console.warn(`No exercises found for types: ${exerciseTypes.join(', ')}. Returning random subset.`);
      const shuffledAll = [...allExercises].sort(() => 0.5 - Math.random());
      return shuffledAll.slice(0, count);
  
    }
    if (filteredExercises.length <= count) {
      return filteredExercises;
    }
    const shuffled = [...filteredExercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Example usage (assuming you want exercises based on the specific type keys I used):
  // const vocabFillBlanks = getSampleExercises(['fill-blanks'], 3); // Will likely get grammar fill-blanks too
  // To get ONLY vocabulary fill-blanks, you might need more specific filtering logic
  // or ensure the 'type' field is more granular if needed, e.g., 'vocabulary-fill-blanks'.
  // For now, the provided function filters by the general 'type' field.