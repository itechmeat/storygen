const translation = {
  HomePage: {
    title: 'Давайте придумаем новую историю!',
    cta: 'Начать писать',
  },
  StoryPage: {
    stories: 'Истории',
    yourStories: 'Ваши истории',
    createNewStory: 'Создать новую историю',
    defaultTitle: 'Новая история',
    prompt: 'Опишите вашу историю',
    model: 'Модель',
    writerStyle: 'Стиль автора',
    writers: {
      murakami: 'Харуки Мураками',
      orwell: 'Джордж Оруэлл',
      kafka: 'Франц Кафка',
      nabokov: 'Владимир Набоков',
      king: 'Стивен Кинг',
      liuCixin: 'Лю Цысинь',
    },
    ownStyle: 'Ваш собственный стиль',
    genre: 'Жанр',
    genres: {
      fantasy: 'Фентази',
      scienceFiction: 'Научная фантастика',
      literaryFiction: 'Литературная фантастика',
      humor: 'Юмор',
      mystery: 'Мистика',
      horror: 'Ужасы',
      thriller: 'Триллер',
      detective: 'Детектив',
      romance: 'Романс',
      historicalFiction: 'Историческая беллетристика',
      memoir: 'Мемуары',
    },
    audience: 'Аудитория',
    audiences: {
      children: 'Дети',
      teenagers: 'Подростки',
      youngAdults: 'Молодёжь',
      adults: 'Взрослые',
      middleGrade: 'Средний возраст',
      seniors: 'Пожилые',
    },
    numberOfScenes: 'Количество сцен',
    generateScenes: 'Сгенерировать сцены',
    generatedScenes: 'Сгенерированные сцены для вашей истории',
    regenerate: 'Перегенерировать с новыми данными',
    generateFullStory: 'Сгенерировать полную историю',
    generatingScene: 'Генерация эпизодов',
    removeScenes: 'Удалить сцены',
    generateMetaData: 'Сгенерировать дополниельные данные',
    generatingMetaData: 'Генерация дополниельных данных',
    removeMetaData: 'Удалить дополниельные данные',
    generateWith: 'с помощью',
    generateCover: 'Сгенерировать обложку',
  },
  prompts: {
    writerVariant: {
      named: 'Ты - популярный автор, который пишет книги в стиле писателя {{writer}}.',
      unnamed: 'Ты - популярный современный писатель.',
    },
    genreVariant: {
      named: 'Напиши историю в жанре {{genre}}.',
      unnamed: 'Выбери наиболее подходящий жанр на основе указанного писателя и текста промпта.',
    },
    audience: 'Возростная аудитория этой истории - {{audience}}.',
    storyGenerator: {
      task: 'Твоя задача - по промпту пользователя составить список из {{num}} эпизодов, которые будут описывать историю.',
      main: `Формат ответа сделай в одном едином JSON:
[{"t": "_название_", "d": "_описание_"}, ... {"t": "_название_", "d": "_описание_"}]
Не нумеруй эпизоды.'
Размер каждого описания около {{size}} символов.
Пришли полный список из всех {{num}} эпизодов без сокращений и пропусков.
В ответе не должно быть ничего, кроме этого JSON.'`,
    },
    sceneGenerator: `В ответе должен содержаться только эпизод и ничего более. Размер эпизода около {{size}} символов. Не нумеруй эпизоды.`,
    scenePrompt: `Требуется написать отдельный эпизод истории на этого основе краткого описания:\n\n{{context}}`,
    sceneSummaryGenerator: `Напиши саммари истории от 300 до 500 символов. В ответе должно содержаться только саммари и ничего более.`,
    storySummaryGenerator: `У меня написана такая история:
{{context}}
Сформируй JSON следующего формата:
{summary: "_summary_", summaryEn: "_summaryEn_", coverText: "_coverText_", coverTextEn: "_coverTextEn_", description: "_description_", storyTitles: ["name1", "name2", ... "name10"]}
где summary - саммари на русском языке, от 300 до 500 символов;
summaryEn - перевод summary на английский язык;
coverText - составь промпт для геренации иллюстрации к этой истории, описание основного место событий для этой истории и краткое описание основных персонажей без упоминания их имен, на русском языке, около 300 символов;
coverTextEn - перевод coverText на английский язык;
description - короткое описание истории на русском языке;
storyTitles - массив из 10 названий истории на русском языке.`,
  },
  notFound: {
    stories: {
      title: 'Истории не найдены',
      subTitle: 'Вы можете создать свою первую историю',
      cta: 'Начать писать',
    },
    story: {
      title: 'История не найдена',
      subTitle: 'Посмотрите ваши другие истории',
      cta: 'Перейти к историям',
    },
  },
  actions: {
    ok: 'Да',
    cancel: 'Отмена',
    yes: 'Да',
    no: 'Нет',
    clearDatabase: 'Очистить базу данных',
  },
  notices: {
    createStory: 'Создать новую историю',
    deleteDB: 'Вы уверены, что хотите удалить базу данных?',
    deleteDBDescription: 'Это действие нельзя будет отменить. Все данные будут утеряны.',
  },
}

export default translation
