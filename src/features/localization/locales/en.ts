const translation = {
  HomePage: {
    title: "Let's make up a new story!",
    cta: 'Start writing',
  },
  StoryPage: {
    stories: 'Stories',
    yourStories: 'Your Stories',
    createNewStory: 'Create new story',
    defaultTitle: 'New Story',
    prompt: 'Describe your story',
    model: 'Model',
    writerStyle: "Writer's style",
    writers: {
      murakami: 'Haruki Murakami',
      orwell: 'George Orwell',
      kafka: 'Franz Kafka',
      nabokov: 'Vladimir Nabokov',
      king: 'Stephen King',
      liuCixin: 'Liu Cixin',
    },
    ownStyle: 'Your own style',
    genre: 'Genre',
    genres: {
      fantasy: 'Fantasy',
      scienceFiction: 'Science Fiction',
      literaryFiction: 'Literary Fiction',
      mystery: 'Mystery',
      horror: 'Horror',
      thriller: 'Thriller',
      detective: 'Detective',
      romance: 'Romance',
      historicalFiction: 'Historical Fiction',
      memoir: 'Memoir',
    },
    audience: 'Audience',
    audiences: {
      children: 'Children',
      teenagers: 'Teenagers',
      youngAdults: 'Young Adults',
      adults: 'Adults',
      middleGrade: 'Middle Grade',
      seniors: 'Seniors',
    },
    numberOfScenes: 'Number of scenes',
    generateScenes: 'Generate scenes',
    generatedScenes: 'Generated scenes for your story',
    regenerate: 'Regenerate with new data',
    generateFullStory: 'Generate full story',
    generatingScene: 'Generating scene',
    removeScenes: 'Remove Scenes',
    generateMetaData: 'Generate Meta Data',
    generatingMetaData: 'Generating Meta Data',
    removeMetaData: 'Remove Meta Data',
    generateWith: 'with',
    generateCover: 'Generate Cover',
  },
  prompts: {
    writerVariant: {
      named: 'You are a popular author who writes books in the style of {{writer}}.',
      unnamed: 'You are a popular modern writer.',
    },
    genreVariant: {
      named: 'Write a story in the {{genre}} genre.',
      unnamed: 'Choose the most suitable genre based on the specified writer and prompt text.',
    },
    audience: 'The target audience of this story is {{audience}}.',
    storyGenerator: {
      task: 'Your task is to create a list of {{num}} episodes based on the user prompt.',
      main: `Format the response in a single JSON:
[{"t": "_title_", "d": "_description_"}, ... {"t": "_title_", "d": "_description_"}]
Do not number the episodes.'
The size of each description is about {{size}} characters.
Send a complete list of all {{num}} episodes without abbreviations or omissions.
There should be nothing in the response except this JSON.`,
    },
    sceneGenerator: `The response should contain only the episode and nothing more. The size of the episode is about {{size}} characters. Do not number the episodes.`,
    scenePrompt: `Write a separate episode of the story based on this brief description:\n\n{{context}}`,
    sceneSummaryGenerator: `Write a summary of the story from 300 to 500 characters. The response should contain only the summary and nothing more.`,
    storySummaryGenerator: `I have this story written:
{{context}}
Generate JSON in the following format:
{summary: "_summary_", coverText: "_coverText_", description: "_description_", storyTitles: ["name1", "name2", ... "name10"]}
where summary is a summary about of the story, from 300 to 500 characters;
coverText - compose a prompt for generating an illustration for this story, a description of the main location of events for this story and a brief description of the main characters without mentioning their names, about 300 characters;
description - a short description of the story;
storyTitles - an array of 10 story titles.
`,
  },
  notFound: {
    stories: {
      title: 'No stories yet',
      subTitle: 'You can create your first story',
      cta: 'Start writing',
    },
    story: {
      title: 'Story not found',
      subTitle: 'See your other stories',
      cta: 'Go to stories',
    },
  },
  actions: {
    ok: 'OK',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    clearDatabase: 'Clear Database',
  },
  notices: {
    createStory: 'Create your new story',
    deleteDB: 'Are you sure to clear your local database?',
    deleteDBDescription: 'Once the database is deleted, you cannot undo this action',
  },
}

export default translation
