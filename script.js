// ===== Wait for DOM to be ready =====
document.addEventListener('DOMContentLoaded', () => {

// ===== SPA Navigation =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function navigateToSection(sectionId) {
    sections.forEach(section => { section.classList.remove('active'); });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) { targetSection.classList.add('active'); }
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) { link.classList.add('active'); }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        window.location.hash = sectionId;
        navigateToSection(sectionId);
        if (sectionId === 'tests') { showTestsList(); }
    });
});

function handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.substring(1);
        if (document.getElementById(sectionId)) {
            navigateToSection(sectionId);
            if (sectionId === 'tests') { showTestsList(); }
        }
    }
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.substring(1);
        if (document.getElementById(sectionId)) {
            navigateToSection(sectionId);
            if (sectionId === 'tests') { showTestsList(); }
        }
    }
});

handleInitialHash();

document.getElementById('heroBtn').addEventListener('click', () => {
    navigateToSection('tests');
    showTestsList();
});

document.querySelectorAll('.test-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const testId = btn.dataset.test;
        navigateToSection('tests');
        setTimeout(() => { startTest(testId); }, 100);
    });
});

// ===== Test Management =====
const testsList = document.getElementById('testsList');
const testInterface = document.getElementById('testInterface');
const testResults = document.getElementById('testResults');
let currentTest = null;
let currentQuestionIndex = 0;
let answers = [];

// ============================================================
// ТЕСТ 1: Климов-5 (20 вопросов, выбор А/Б)
// ============================================================
const klimov = {
    title: 'Климов-5: Тип профессии',
    description: 'Определяет ваш предрасположенный тип объекта труда: природа, техника, люди, знаковые системы или художественный образ.',
    totalQuestions: 20,
    scaleLabels: {
        cp: 'Ч–П (Человек–Природа)',
        ct: 'Ч–Т (Человек–Техника)',
        ch: 'Ч–Ч (Человек–Человек)',
        cz: 'Ч–З (Человек–Знаковая система)',
        cx: 'Ч–ХО (Человек–Художественный образ)'
    },
    questions: [
        { text: 'Что вам ближе?', options: [
            { text: 'Ухаживать за растениями, наблюдать их рост', value: 'cp', score: 1 },
            { text: 'Собирать/настраивать простой механизм', value: 'ct', score: 1 }
        ]},
        { text: 'Что вам интереснее?', options: [
            { text: 'Объяснять человеку тему, помогать разобраться', value: 'ch', score: 1 },
            { text: 'Работать с таблицами, кодами, классификацией', value: 'cz', score: 1 }
        ]},
        { text: 'Что вам ближе?', options: [
            { text: 'Придумывать визуальный образ (постер/логотип/сцену)', value: 'cx', score: 1 },
            { text: 'Наблюдать животных/природные явления и вести записи', value: 'cp', score: 1 }
        ]},
        { text: 'Что предпочитаете?', options: [
            { text: 'Разбираться, почему устройство «глючит», и чинить', value: 'ct', score: 1 },
            { text: 'Строить аккуратную систему учёта/архив/реестр', value: 'cz', score: 1 }
        ]},
        { text: 'Что вам по душе?', options: [
            { text: 'Улаживать конфликты, договариваться между людьми', value: 'ch', score: 1 },
            { text: 'Делать что-то творческое «с нуля» (текст/музыка/дизайн)', value: 'cx', score: 1 }
        ]},
        { text: 'Что вам интереснее?', options: [
            { text: 'Упорядочивать информацию: схемы, инструкции, базы', value: 'cz', score: 1 },
            { text: 'Работать «в поле»: почва, растения, погодные условия', value: 'cp', score: 1 }
        ]},
        { text: 'Что вам ближе?', options: [
            { text: 'Проводить настройку техники/оборудования', value: 'ct', score: 1 },
            { text: 'Помогать человеку выбрать решение (совет/поддержка)', value: 'ch', score: 1 }
        ]},
        { text: 'Что предпочитаете?', options: [
            { text: 'Рисовать/оформлять/создавать стиль', value: 'cx', score: 1 },
            { text: 'Делать строгие форматы: отчёт, код, таблица', value: 'cz', score: 1 }
        ]},
        { text: 'Что вам интереснее?', options: [
            { text: 'Заниматься природными объектами (сад, экология, животные)', value: 'cp', score: 1 },
            { text: 'Учить/консультировать/сопровождать людей', value: 'ch', score: 1 }
        ]},
        { text: 'Что вам ближе?', options: [
            { text: 'Проектировать/собирать/улучшать устройство или процесс', value: 'ct', score: 1 },
            { text: 'Придумывать творческую концепцию/сюжет/образ', value: 'cx', score: 1 }
        ]},
        { text: 'Что предпочитаете?', options: [
            { text: 'Анализировать данные, искать закономерности в цифрах', value: 'cz', score: 1 },
            { text: 'Проводить беседы, интервью, диагностику потребностей', value: 'ch', score: 1 }
        ]},
        { text: 'Что вам интереснее?', options: [
            { text: 'Исследовать растения/продукты/биопроцессы', value: 'cp', score: 1 },
            { text: 'Делать визуальную/художественную подачу информации', value: 'cx', score: 1 }
        ]},
        { text: 'Что вам ближе?', options: [
            { text: 'Работать с инструментом/станком/оборудованием', value: 'ct', score: 1 },
            { text: 'Заботиться о живом: разведение, уход, профилактика', value: 'cp', score: 1 }
        ]},
        { text: 'Что предпочитаете?', options: [
            { text: 'Организовывать людей, распределять роли, поддерживать', value: 'ch', score: 1 },
            { text: 'Формализовать правила: классификация, кодировка, регламент', value: 'cz', score: 1 }
        ]},
        { text: 'Что вам интереснее?', options: [
            { text: 'Делать иллюстрации/видео/сценографию/декор', value: 'cx', score: 1 },
            { text: 'Контролировать качество сборки/настройки техники', value: 'ct', score: 1 }
        ]},
        { text: 'Что вам ближе?', options: [
            { text: 'Следить за жизненным циклом «живого» проекта (растения/экосистема)', value: 'cp', score: 1 },
            { text: 'Писать точные инструкции, вести учёт, заполнять формы', value: 'cz', score: 1 }
        ]},
        { text: 'Что предпочитаете?', options: [
            { text: 'Наставничество: обучать, развивать человека', value: 'ch', score: 1 },
            { text: 'Работать с природой/живыми системами, наблюдать динамику', value: 'cp', score: 1 }
        ]},
        { text: 'Что вам интереснее?', options: [
            { text: 'Строить логику данных: структуры, поля, проверки', value: 'cz', score: 1 },
            { text: 'Создавать художественное впечатление (свет/цвет/ритм/стиль)', value: 'cx', score: 1 }
        ]},
        { text: 'Что вам ближе?', options: [
            { text: 'Настраивать процессы производства/технику безопасности', value: 'ct', score: 1 },
            { text: 'Много общаться: сервис, помощь, сопровождение', value: 'ch', score: 1 }
        ]},
        { text: 'Что предпочитаете?', options: [
            { text: 'Делать дизайн/креатив для бренда/проекта', value: 'cx', score: 1 },
            { text: 'Исследовать и систематизировать данные/коды/знаки', value: 'cz', score: 1 }
        ]}
    ],
    results: {
        cp: {
            title: 'Ч–П (Человек–Природа)',
            description: 'Вам ближе работа с живыми и природными системами: наблюдение, уход, улучшение состояния, понимание циклов и взаимосвязей. Подойдут направления: агро/био, экология, ветеринария и зоосфера, лабораторные и полевые наблюдения, пищевые/натуральные продукты, природоохранные проекты.',
            professions: ['Биолог', 'Ветеринар', 'Агроном', 'Эколог', 'Лесник', 'Зоотехник']
        },
        ct: {
            title: 'Ч–Т (Человек–Техника)',
            description: 'Вам нравится разбираться, как устроены вещи, и делать так, чтобы они работали: сборка, настройка, ремонт, оптимизация процессов, инженерная логика. Подойдут направления: инженерия, эксплуатация и сервис, производство, автоматизация, мехатроника, электрика/электроника.',
            professions: ['Инженер', 'Механик', 'Электрик', 'Техник', 'Программист', 'Архитектор']
        },
        ch: {
            title: 'Ч–Ч (Человек–Человек)',
            description: 'Ваш фокус — взаимодействие с людьми: обучение, помощь, координация, переговоры, поддержка, развитие. Подойдут направления: обучение, HR/рекрутинг, психология/коучинг, медицина и уход, сервис, управление командами, социальные проекты.',
            professions: ['Учитель', 'Психолог', 'Врач', 'Менеджер по персоналу', 'Социальный работник', 'Консультант']
        },
        cz: {
            title: 'Ч–З (Человек–Знаковая система)',
            description: 'Вам комфортно там, где много информации, структуры и точности: данные, формулы, документы, коды, классификаторы, правила. Подойдут направления: аналитика, финансы/учёт, юриспруденция, программирование, тестирование, документация, логистика.',
            professions: ['Программист', 'Бухгалтер', 'Аналитик', 'Юрист', 'Переводчик', 'Логист']
        },
        cx: {
            title: 'Ч–ХО (Человек–Художественный образ)',
            description: 'Вам важно создавать впечатление, форму и смысл: визуал, текст, звук, сцена, стиль, история, эстетика. Подойдут направления: дизайн (графический/продуктовый/интерьер), контент и медиа, бренд и коммуникации, фото/видео, музыка, иллюстрация, креативные индустрии.',
            professions: ['Дизайнер', 'Художник', 'Фотограф', 'Видеограф', 'Музыкант', 'Копирайтер']
        }
    }
};

// ============================================================
// ТЕСТ 2: RIASEC-48 (авторская версия по модели Холланда)
// Шкала: 1–5 (совсем не интересно ... очень интересно)
// ============================================================
const holland = {
    title: 'RIASEC-48: Профессиональные интересы',
    description: 'Определяет ваш стиль профессиональной деятельности по модели Холланда. Результат — код из 3 букв (три самых высоких шкалы).',
    totalQuestions: 48,
    isLikert: true,
    likertOptions: [
        { text: 'Совсем не интересно', score: 1 },
        { text: 'Скорее не интересно', score: 2 },
        { text: 'Нейтрально', score: 3 },
        { text: 'Скорее интересно', score: 4 },
        { text: 'Очень интересно', score: 5 }
    ],
    questions: [
        // R (Realistic) — 8 вопросов
        { text: 'Мне нравится работать руками с инструментами', category: 'R' },
        { text: 'Мне интересно чинить/настраивать технику', category: 'R' },
        { text: 'Мне нравится активная работа, где много движения', category: 'R' },
        { text: 'Мне было бы комфортно работать на открытом воздухе', category: 'R' },
        { text: 'Мне нравится видеть осязаемый результат (собрал/построил/сделал)', category: 'R' },
        { text: 'Мне интересно управлять оборудованием/механизмами', category: 'R' },
        { text: 'Мне нравится улучшать «как работает» процесс (быстрее/надёжнее)', category: 'R' },
        { text: 'Мне комфортно соблюдать технику безопасности и точные инструкции', category: 'R' },
        // I (Investigative) — 8 вопросов
        { text: 'Мне нравится анализировать причины и следствия', category: 'I' },
        { text: 'Мне интересно проводить небольшие исследования/эксперименты', category: 'I' },
        { text: 'Мне нравится решать сложные логические задачи', category: 'I' },
        { text: 'Мне нравится искать закономерности в данных', category: 'I' },
        { text: 'Мне интересно читать/смотреть про науку и технологии «в глубину»', category: 'I' },
        { text: 'Мне нравится строить модели, гипотезы, объяснения', category: 'I' },
        { text: 'Мне интересно разбираться в устройстве систем (био/соц/тех)', category: 'I' },
        { text: 'Мне нравится работать там, где важно думать и проверять идеи', category: 'I' },
        // A (Artistic) — 8 вопросов
        { text: 'Мне нравится придумывать новые идеи для текста/визуала/музыки', category: 'A' },
        { text: 'Мне важно, чтобы в работе было творчество и свобода формы', category: 'A' },
        { text: 'Мне нравится делать дизайн/оформление/стиль', category: 'A' },
        { text: 'Мне нравится писать: тексты, истории, сценарии', category: 'A' },
        { text: 'Мне нравится создавать «настроение» через цвет/звук/слово', category: 'A' },
        { text: 'Мне интересно делать контент (фото/видео/монтаж/подача)', category: 'A' },
        { text: 'Мне нравится придумывать необычные решения', category: 'A' },
        { text: 'Мне нравится работать там, где ценят оригинальность', category: 'A' },
        // S (Social) — 8 вопросов
        { text: 'Мне нравится объяснять и обучать других', category: 'S' },
        { text: 'Мне важно быть полезным людям и видеть их прогресс', category: 'S' },
        { text: 'Мне комфортно внимательно слушать и поддерживать', category: 'S' },
        { text: 'Мне нравится решать проблемы клиентов/пользователей', category: 'S' },
        { text: 'Мне интересно организовывать обучение/мероприятия/комьюнити', category: 'S' },
        { text: 'Мне нравится работать в команде и помогать наладить взаимодействие', category: 'S' },
        { text: 'Мне интересно наставничество, сопровождение, консультирование', category: 'S' },
        { text: 'Мне важно, чтобы работа делала жизнь людей лучше', category: 'S' },
        // E (Enterprising) — 8 вопросов
        { text: 'Мне нравится убеждать и влиять на решение', category: 'E' },
        { text: 'Мне комфортно вести переговоры и отстаивать позицию', category: 'E' },
        { text: 'Мне нравится брать ответственность за результат команды/проекта', category: 'E' },
        { text: 'Мне нравится ставить цели и «продавливать» их выполнение', category: 'E' },
        { text: 'Мне интересно запускать проекты/продукты и продвигать их', category: 'E' },
        { text: 'Мне нравится конкуренция и достижение измеримых целей', category: 'E' },
        { text: 'Мне комфортно выступать, презентовать, питчить', category: 'E' },
        { text: 'Мне нравится договариваться о ресурсах: деньги, люди, сроки', category: 'E' },
        // C (Conventional) — 8 вопросов
        { text: 'Мне нравится порядок в файлах, задачах, документах', category: 'C' },
        { text: 'Мне комфортно работать по правилам и регламентам', category: 'C' },
        { text: 'Мне нравится вести учёт, заполнять формы, проверять точность', category: 'C' },
        { text: 'Мне нравится планирование: календарь, сроки, чек-листы', category: 'C' },
        { text: 'Мне комфортно работать с таблицами и отчётами', category: 'C' },
        { text: 'Мне нравится доводить задачи до «идеально оформленного» состояния', category: 'C' },
        { text: 'Мне нравится, когда процессы стандартизированы и предсказуемы', category: 'C' },
        { text: 'Мне комфортно, когда понятно «как правильно» и есть критерии качества', category: 'C' }
    ],
    results: {
        R: { title: 'R — Практический', description: 'Техника, инструмент, «сделать руками», конкретный результат. Вам нравится работать с физическими объектами и видеть осязаемый итог труда.', professions: ['Механик', 'Электрик', 'Инженер', 'Строитель', 'Техник', 'Оператор оборудования'] },
        I: { title: 'I — Исследовательский', description: 'Анализ, исследования, сложные задачи, гипотезы, данные. Вы любите докапываться до сути и проверять идеи.', professions: ['Учёный', 'Аналитик', 'Программист', 'Лаборант', 'Математик', 'Биолог'] },
        A: { title: 'A — Творческий', description: 'Самовыражение, эстетика, новые идеи, оригинальная форма. Вы стремитесь создавать что-то уникальное и красивое.', professions: ['Дизайнер', 'Художник', 'Фотограф', 'Видеограф', 'Копирайтер', 'Музыкант'] },
        S: { title: 'S — Социальный', description: 'Помощь людям, обучение, поддержка, развитие, взаимодействие. Вам важно быть полезным и видеть прогресс других.', professions: ['Учитель', 'Психолог', 'Социальный работник', 'Врач', 'Тренер', 'HR-специалист'] },
        E: { title: 'E — Предпринимательский', description: 'Влияние, переговоры, лидерство, продажи/продвижение, цели. Вы амбициозны и умеете убеждать.', professions: ['Менеджер', 'Предприниматель', 'Маркетолог', 'Продавец', 'Директор', 'Юрист'] },
        C: { title: 'C — Организационный', description: 'Порядок, учёт, точность, регламенты, администрирование. Вам нравится структурированность и чёткие правила.', professions: ['Бухгалтер', 'Администратор', 'Делопроизводитель', 'Архивариус', 'Секретарь', 'Логист'] }
    }
};

// ============================================================
// ТЕСТ 3: Ценности работы-30 (Work Values по O*NET)
// Шкала: 1–5 (совсем не важно ... очень важно)
// ============================================================
const values = {
    title: 'Ценности работы-30',
    description: 'Определяет, какие условия труда наиболее важны для вашей мотивации и предотвращения выгорания.',
    totalQuestions: 30,
    isLikert: true,
    likertOptions: [
        { text: 'Совсем не важно', score: 1 },
        { text: 'Скорее не важно', score: 2 },
        { text: 'Умеренно важно', score: 3 },
        { text: 'Важно', score: 4 },
        { text: 'Очень важно', score: 5 }
    ],
    questions: [
        // Achievement — 5 вопросов
        { text: 'На работе мне важно видеть измеримый результат своих усилий', category: 'achievement' },
        { text: 'Постоянно расти в мастерстве и делать работу «всё лучше»', category: 'achievement' },
        { text: 'Решать сложные задачи, которыми можно гордиться', category: 'achievement' },
        { text: 'Понимать, что моя работа реально влияет на итог', category: 'achievement' },
        { text: 'Получать ощущение «я сделал(а) важное дело»', category: 'achievement' },
        // Independence — 5 вопросов
        { text: 'Самостоятельно выбирать способы выполнения задач', category: 'independence' },
        { text: 'Иметь свободу в принятии решений в своей зоне', category: 'independence' },
        { text: 'Гибко планировать время и подход к работе', category: 'independence' },
        { text: 'Чтобы мне доверяли и не контролировали каждый шаг', category: 'independence' },
        { text: 'Пробовать новые подходы без лишней бюрократии', category: 'independence' },
        // Recognition — 5 вопросов
        { text: 'Получать признание за свой вклад', category: 'recognition' },
        { text: 'Видеть прозрачные карьерные перспективы', category: 'recognition' },
        { text: 'Иметь статус/роль, которую уважают', category: 'recognition' },
        { text: 'Чтобы достижения замечали и отмечали', category: 'recognition' },
        { text: 'Чтобы успех был видимым для других', category: 'recognition' },
        // Relationships — 5 вопросов
        { text: 'Хорошие отношения с людьми рядом', category: 'relationships' },
        { text: 'Работать с людьми, с которыми приятно общаться', category: 'relationships' },
        { text: 'Чувствовать, что я часть команды', category: 'relationships' },
        { text: 'Помогать людям и получать тёплую обратную связь', category: 'relationships' },
        { text: 'Минимум токсичности и конфликтов вокруг', category: 'relationships' },
        // Support — 5 вопросов
        { text: 'Адекватное руководство и понятные ожидания', category: 'support' },
        { text: 'Справедливые правила и честное отношение', category: 'support' },
        { text: 'Чтобы меня обучали и помогали входить в задачи', category: 'support' },
        { text: 'Чтобы в компании было «можно попросить помощь»', category: 'support' },
        { text: 'Чтобы ценили благополучие сотрудников, а не «выжимали»', category: 'support' },
        // Working Conditions — 5 вопросов
        { text: 'Комфортные условия (место, режим, нагрузка)', category: 'working_conditions' },
        { text: 'Предсказуемость и стабильность', category: 'working_conditions' },
        { text: 'Достойная оплата и понятная система бонусов', category: 'working_conditions' },
        { text: 'Разумный баланс работа/жизнь', category: 'working_conditions' },
        { text: 'Безопасность и отсутствие постоянного стресса', category: 'working_conditions' }
    ],
    results: {
        achievement: { title: 'Достижения', description: 'Вам важны сложные задачи, рост мастерства, ощущение «я умею и делаю круто». Вы мотивированы, когда видите реальный результат и чувствуете гордость за свою работу.' },
        independence: { title: 'Независимость', description: 'Вам важны автономия, свобода способа работы, доверие, гибкость. Вы предпочитаете самостоятельно выбирать подход к задачам и не любите мелкий контроль.' },
        recognition: { title: 'Признание', description: 'Вам важны статус, заметность вклада, продвижение, роль «с весом». Вы мотивированы, когда ваши достижения видны и отмечены.' },
        relationships: { title: 'Отношения', description: 'Вам важны команда, атмосфера, коммуникации, польза людям. Вы цените тёплые отношения на работе и стремитесь быть полезным.' },
        support: { title: 'Поддержка', description: 'Вам важны адекватный менеджмент, справедливость, обучение, забота о людях. Вы хотите работать в среде, где можно попросить помощь и получить её.' },
        working_conditions: { title: 'Условия труда', description: 'Вам важны стабильность, деньги/компенсации, безопасность, баланс и комфорт. Вы цените предсказуемость и разумную нагрузку.' }
    }
};

const testsData = { klimov, holland, values };

function showTestsList() {
    testsList.style.display = 'block';
    testInterface.style.display = 'none';
    testResults.style.display = 'none';
}

function showTestInterface() {
    testsList.style.display = 'none';
    testInterface.style.display = 'block';
    testResults.style.display = 'none';
}

function showTestResults() {
    testsList.style.display = 'none';
    testInterface.style.display = 'none';
    testResults.style.display = 'block';
}

function startTest(testId) {
    // Clean up ALL previous results (including dynamically added ones)
    document.getElementById('customResults')?.remove();
    document.querySelectorAll('.custom-bars').forEach(el => el.remove());
    // Remove any dynamically added .results-professions (from Holland/Values)
    document.querySelectorAll('.results-professions').forEach(el => {
        if (!el.querySelector('ul#professionsList')) {
            el.remove();
        }
    });
    // Restore original results container
    const resultsProfessions = document.querySelector('.results-professions');
    if (resultsProfessions) { resultsProfessions.style.display = ''; }
    document.getElementById('resultsType').style.display = '';
    document.getElementById('resultsDescription').textContent = 'Описание типа появится здесь';
    document.getElementById('professionsList').innerHTML = '';

    currentTest = testsData[testId];
    currentQuestionIndex = 0;
    answers = [];
    showTestInterface();
    displayQuestion();
}

function displayQuestion() {
    const question = currentTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.totalQuestions) * 100;

    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Вопрос ${currentQuestionIndex + 1} из ${currentTest.totalQuestions}`;
    document.getElementById('questionTitle').textContent = question.text;

    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    if (currentTest.isLikert) {
        // Likert scale (1-5)
        currentTest.likertOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'answer-option';
            btn.textContent = opt.text;
            btn.dataset.score = opt.score;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.answer-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('nextBtn').disabled = false;
            });
            answersContainer.appendChild(btn);
        });
    } else {
        // A/B choice
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-option';
            btn.textContent = option.text;
            btn.dataset.value = option.value;
            btn.dataset.score = option.score;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.answer-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('nextBtn').disabled = false;
            });
            answersContainer.appendChild(btn);
        });
    }

    document.getElementById('nextBtn').disabled = true;

    // Update button text for last question
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestionIndex === currentTest.totalQuestions - 1) {
        nextBtn.textContent = 'Показать результат';
    } else {
        nextBtn.textContent = 'Далее';
    }
}

document.getElementById('nextBtn').addEventListener('click', () => {
    const selectedOption = document.querySelector('.answer-option.selected');
    if (selectedOption) {
        const answer = {
            questionIndex: currentQuestionIndex,
            score: parseInt(selectedOption.dataset.score)
        };
        if (selectedOption.dataset.value) {
            answer.value = selectedOption.dataset.value;
        }
        if (currentTest.questions[currentQuestionIndex].category) {
            answer.category = currentTest.questions[currentQuestionIndex].category;
        }
        answers.push(answer);

        currentQuestionIndex++;

        if (currentQuestionIndex < currentTest.totalQuestions) {
            displayQuestion();
        } else {
            calculateAndShowResults();
        }
    }
});

function calculateAndShowResults() {
    const scores = {};

    // Remove ALL previous dynamic results
    document.getElementById('customResults')?.remove();
    document.querySelectorAll('.custom-bars').forEach(el => el.remove());
    // Remove dynamically added .results-professions (from previous Holland/Values)
    document.querySelectorAll('.results-professions').forEach(el => {
        if (!el.querySelector('ul#professionsList')) {
            el.remove();
        }
    });

    if (currentTest.isLikert) {
        // For Likert: sum by category
        answers.forEach(answer => {
            const cat = answer.category;
            if (!scores[cat]) { scores[cat] = 0; }
            scores[cat] += answer.score;
        });

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const testId = Object.keys(testsData).find(key => testsData[key] === currentTest);

        document.getElementById('resultsType').style.display = 'none';
        document.getElementById('resultsDescription').textContent = '';
        document.getElementById('professionsList').innerHTML = '';
        document.querySelector('.results-professions')?.querySelector('h3') && (document.querySelector('.results-professions').style.display = 'none');

        let resultsHTML = '';

        if (testId === 'holland') {
            const top3 = sorted.slice(0, 3);
            const code = top3.map(item => item[0]).join('');
            const titles = top3.map(item => currentTest.results[item[0]]?.title || item[0]).join(' + ');
            const maxPossible = 40;

            resultsHTML += `<div id="customResults">`;
            resultsHTML += `<div class="results-type" style="font-size:1.25rem;">${titles}</div>`;
            resultsHTML += `<p class="results-description" style="margin-bottom:var(--spacing-xl);">Ваш RIASEC-код: <strong>${code}</strong></p>`;
            resultsHTML += `<div class="custom-bars" style="text-align:left;">`;
            sorted.forEach(([type, score]) => {
                const pct = Math.round((score / maxPossible) * 100);
                const result = currentTest.results[type];
                resultsHTML += `<div class="riasec-bar-item" style="margin-bottom:var(--spacing-md);">
                    <div class="riasec-bar-label"><strong>${result?.title || type}</strong></div>
                    <div class="riasec-bar-track"><div class="riasec-bar-fill" style="width:${pct}%"></div></div>
                    <div class="riasec-bar-score">${score} из ${maxPossible}</div>
                </div>`;
            });
            resultsHTML += `</div>`;

            // Professions
            resultsHTML += `<div class="results-professions" style="background-color:var(--color-bg-light);padding:var(--spacing-2xl);border-radius:var(--border-radius-lg);margin-top:var(--spacing-xl);text-align:left;"><h3 style="margin-bottom:var(--spacing-lg);color:var(--color-text);">Рекомендуемые профессии:</h3><ul style="list-style:none;padding:0;">`;
            const seen = new Set();
            top3.forEach(([type]) => {
                const result = currentTest.results[type];
                if (result) {
                    result.professions.forEach(p => {
                        if (!seen.has(p)) {
                            seen.add(p);
                            resultsHTML += `<li style="padding:var(--spacing-md) 0;color:var(--color-text);">${p}</li>`;
                        }
                    });
                }
            });
            resultsHTML += `</ul></div></div>`;
            document.getElementById('testResults').insertAdjacentHTML('afterbegin', resultsHTML);

        } else if (testId === 'values') {
            const maxValue = 25;
            const top2 = sorted.slice(0, 2);
            const titles = top2.map(item => currentTest.results[item[0]]?.title || item[0]).join(' + ');

            resultsHTML += `<div id="customResults">`;
            resultsHTML += `<div class="results-type" style="font-size:1.25rem;">${titles}</div>`;
            resultsHTML += `<p class="results-description" style="margin-bottom:var(--spacing-xl);">Ваши главные ценности — ваши «условия счастья» на работе.</p>`;

            const allHigh = sorted.every(([, score]) => { const avg = score / 5; return avg >= 4.2; });
            if (allHigh) {
                resultsHTML += `<p class="results-highlight" style="background:linear-gradient(135deg,rgba(102,126,234,0.1),rgba(118,75,162,0.1));padding:var(--spacing-lg);border-radius:var(--border-radius);border-left:4px solid var(--color-primary);margin-bottom:var(--spacing-xl);text-align:left;">Вам важны все ценности — это значит, что для вас критично найти «идеальную вакансию» с хорошими условиями.</p>`;
            }

            resultsHTML += `<div class="custom-bars" style="text-align:left;">`;
            sorted.forEach(([type, score]) => {
                const avg = (score / 5).toFixed(1);
                const pct = Math.round((score / maxValue) * 100);
                const result = currentTest.results[type];
                resultsHTML += `<div class="riasec-bar-item" style="margin-bottom:var(--spacing-xl);">
                    <div class="riasec-bar-label"><strong>${result?.title || type}</strong> <span style="opacity:0.7">(${avg} / 5.0)</span></div>
                    <div class="riasec-bar-track"><div class="riasec-bar-fill" style="width:${pct}%"></div></div>
                    <div class="riasec-bar-score" style="font-size:0.85rem;color:var(--color-text-light);margin-top:0.5rem;">${result?.description || ''}</div>
                </div>`;
            });
            resultsHTML += `</div></div>`;
            document.getElementById('testResults').insertAdjacentHTML('afterbegin', resultsHTML);
        }
    } else {
        // Klimov: count by type
        answers.forEach(answer => {
            const val = answer.value;
            if (!scores[val]) { scores[val] = 0; }
            scores[val] += answer.score;
        });

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const resultType = sorted[0]?.[0] || '';
        const secondType = sorted[1]?.[0] || '';
        const result = currentTest.results[resultType];
        if (!result) return;

        document.getElementById('resultsType').style.display = '';
        document.getElementById('resultsType').textContent = result.title;
        document.querySelector('.results-professions') && (document.querySelector('.results-professions').style.display = '');

        let desc = result.description;
        if (sorted[1] && sorted[0][1] - sorted[1][1] <= 1) {
            desc += ' Также у вас выражен второй тип: ' + (currentTest.results[secondType]?.title || '') + '. Это смешанный профиль — вам могут подойти гибридные направления.';
        }
        document.getElementById('resultsDescription').textContent = desc;

        // Show all scores
        let barsHTML = '<div class="custom-bars riasec-bars">';
        const maxPossibleKlimov = 8;
        sorted.forEach(([type, score]) => {
            const pct = Math.round((score / maxPossibleKlimov) * 100);
            const label = currentTest.scaleLabels[type] || type;
            barsHTML += `<div class="riasec-bar-item">
                <div class="riasec-bar-label"><strong>${label}</strong></div>
                <div class="riasec-bar-track"><div class="riasec-bar-fill" style="width:${pct}%"></div></div>
                <div class="riasec-bar-score">${score} из ${maxPossibleKlimov}</div>
            </div>`;
        });
        barsHTML += '</div>';
        document.getElementById('resultsDescription').insertAdjacentHTML('afterend', barsHTML);

        // Professions
        document.getElementById('professionsList').innerHTML = '';
        result.professions.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            document.getElementById('professionsList').appendChild(li);
        });
    }

    showTestResults();
}

document.getElementById('retakeBtn').addEventListener('click', () => {
    document.getElementById('customResults')?.remove();
    document.querySelectorAll('.custom-bars').forEach(el => el.remove());
    document.getElementById('resultsType').style.display = '';
    document.querySelector('.results-professions') && (document.querySelector('.results-professions').style.display = '');
    if (currentTest) {
        currentQuestionIndex = 0;
        answers = [];
        showTestInterface();
        displayQuestion();
    }
});

document.getElementById('backToTestsBtn').addEventListener('click', () => {
    document.getElementById('customResults')?.remove();
    document.querySelectorAll('.custom-bars').forEach(el => el.remove());
    document.getElementById('resultsType').style.display = '';
    document.querySelector('.results-professions') && (document.querySelector('.results-professions').style.display = '');
    showTestsList();
    currentTest = null;
    currentQuestionIndex = 0;
    answers = [];
});

document.querySelectorAll('.start-test').forEach(btn => {
    btn.addEventListener('click', () => {
        const testId = btn.dataset.test;
        startTest(testId);
    });
});

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function updateThemeIcon(theme) {
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    if (themeIcon) { themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙'; }
}

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// ===== Institutions Management =====
let institutionsData = null;
let currentFilter = 'all';

const institutionsDataEmbedded = {
  "categories": [
    {"id": "all", "name": "Все"},
    {"id": "college", "name": "Колледжи"},
    {"id": "technikum", "name": "Техникумы"},
    {"id": "branch", "name": "Филиалы"}
  ],
  "institutions": [
    {
      "id": "miass_susu",
      "name": "Южно-Уральский государственный университет (НИУ), филиал в г. Миасс",
      "type": "branch", "typeName": "Филиал вуза",
      "logo": "images/institutions/miass_susu-logo.jpg",
      "shortDescription": "Ведущий технический университет Челябинской области",
      "fullDescription": "Филиал Южно-Уральского государственного университета (НИУ) в г. Миасс предлагает программы высшего образования по техническим и гуманитарным направлениям. Университет входит в число ведущих технических вузов России.",
      "address": "456318, г. Миасс, пр. Октября, 16",
      "phone": "+7 (3513) 55-00-00",
      "website": "http://www.miass.susu.ru/",
      "specialties": ["Прикладная информатика", "Менеджмент", "Экономика", "Юриспруденция", "Педагогическое образование"],
      "gallery": ["images/institutions/miass_susu-1.jpg", "images/institutions/miass_susu-2.jpg", "images/institutions/miass_susu-3.jpg"]
    },
    {
      "id": "miass_chelsu",
      "name": "Челябинский государственный университет, Миасский филиал",
      "type": "branch", "typeName": "Филиал вуза",
      "logo": "images/institutions/miass_chelsu-logo.jpg",
      "shortDescription": "Классическое университетское образование. Включает Колледж ЧелГУ",
      "fullDescription": "Миасский филиал Челябинского государственного университета предлагает программы бакалавриата, магистратуры и СПО.",
      "address": "г. Миасс, ул. Керченская, 1",
      "phone": "+7 (3513) 55-00-01",
      "website": "https://csu-miass.ru/",
      "specialties": ["Филология", "История", "Математика и информатика", "Биология", "Экономика"],
      "gallery": ["images/institutions/miass_chelsu-1.jpg", "images/institutions/miass_chelsu-2.jpg", "images/institutions/miass_chelsu-3.jpg"]
    },
    {
      "id": "mgrk",
      "name": "Миасский геологоразведочный колледж",
      "type": "college", "typeName": "Колледж",
      "logo": "images/institutions/mgrk-logo.jpg",
      "shortDescription": "Единственный в регионе колледж геологоразведочного профиля",
      "fullDescription": "Миасский геологоразведочный колледж — уникальное учебное заведение, готовящее специалистов для геологоразведочной отрасли.",
      "address": "пр. Автозаводцев, 43; ул. Лихачёва, 15; ул. Ферсмана, 2а",
      "phone": "+7 (3513) 55-10-00",
      "website": "https://miassgrk.ru/",
      "specialties": ["Геологоразведка", "Бурение скважин", "Маркшейдерское дело", "Прикладная геология"],
      "gallery": ["images/institutions/mgrk-1.jpg", "images/institutions/mgrk-2.jpg", "images/institutions/mgrk-3.jpg"]
    },
    {
      "id": "mimk",
      "name": "Миасский машиностроительный колледж",
      "type": "college", "typeName": "Колледж",
      "logo": "images/institutions/mimk-logo.jpg",
      "shortDescription": "Подготовка специалистов для автомобильной отрасли",
      "fullDescription": "Миасский машиностроительный колледж готовит специалистов для работы на предприятиях автомобильной и машиностроительной отрасли.",
      "address": "пр. Октября, 1; пр. Октября, 4; Предзаводская площадь, 1",
      "phone": "+7 (3513) 55-20-00",
      "website": "https://miassmk.ru/",
      "specialties": ["Технология машиностроения", "Автомобилестроение", "ТО и ремонт", "Сварочное производство"],
      "gallery": ["images/institutions/mimk-1.jpg", "images/institutions/mimk-2.jpg", "images/institutions/mimk-3.jpg"]
    },
    {
      "id": "mpk",
      "name": "Миасский педагогический колледж",
      "type": "college", "typeName": "Колледж",
      "logo": "images/institutions/mpk-logo.jpg",
      "shortDescription": "Подготовка учителей и воспитателей",
      "fullDescription": "Миасский педагогический колледж готовит специалистов для школ и детских садов.",
      "address": "456316, г. Миасс, ул. Парковая, 2а",
      "phone": "+7 (3513) 55-30-00",
      "website": "https://miasspk.ru/",
      "specialties": ["Преподавание в начальных классах", "Дошкольное образование", "Коррекционная педагогика"],
      "gallery": ["images/institutions/mpk-1.jpg", "images/institutions/mpk-2.jpg", "images/institutions/mpk-3.jpg"]
    },
    {
      "id": "mmk",
      "name": "Миасский медицинский колледж",
      "type": "college", "typeName": "Колледж",
      "logo": "images/institutions/mmk-logo.jpg",
      "shortDescription": "Подготовка среднего медицинского персонала",
      "fullDescription": "Миасский медицинский колледж готовит медицинских сестёр, фельдшеров и фармацевтов.",
      "address": "456300, г. Миасс, ул. Романенко, 48",
      "phone": "+7 (3513) 55-40-00",
      "website": "https://miassmed.tmweb.ru/",
      "specialties": ["Сестринское дело", "Лечебное дело", "Фармация", "Лабораторная диагностика"],
      "gallery": ["images/institutions/mmk-1.jpg", "images/institutions/mmk-2.jpg", "images/institutions/mmk-3.jpg"]
    },
    {
      "id": "mgkik",
      "name": "Миасский государственный колледж искусства и культуры",
      "type": "college", "typeName": "Колледж",
      "logo": "images/institutions/mgkik-logo.jpg",
      "shortDescription": "Творческие профессии в сфере культуры",
      "fullDescription": "Колледж готовит специалистов для учреждений культуры, музыкальных школ и театров.",
      "address": "пр. Автозаводцев, 10Б; ул. Орловская, 11",
      "phone": "+7 (3513) 55-50-00",
      "website": "https://колледжискусствмиасс.рф/",
      "specialties": ["Музыкальное искусство", "Народное художественное творчество", "Сольное и хоровое пение"],
      "gallery": ["images/institutions/mgkik-1.jpg", "images/institutions/mgkik-2.jpg", "images/institutions/mgkik-3.jpg"]
    },
    {
      "id": "mst",
      "name": "Миасский строительный техникум",
      "type": "technikum", "typeName": "Техникум",
      "logo": "images/institutions/mst-logo.jpg",
      "shortDescription": "Подготовка специалистов для строительной отрасли",
      "fullDescription": "Техникум готовит специалистов для строительной отрасли.",
      "address": "г. Миасс, ул. Лихачёва, 15",
      "phone": "+7 (3513) 55-60-00",
      "website": "https://mst49.ru/",
      "specialties": ["Строительство и эксплуатация зданий", "Архитектура", "Мастер отделочных работ"],
      "gallery": ["images/institutions/mst-1.jpg", "images/institutions/mst-2.jpg", "images/institutions/mst-3.jpg"]
    },
    {
      "id": "chuk_miass",
      "name": "Челябинский юридический колледж — филиал в г. Миассе",
      "type": "branch", "typeName": "Филиал колледжа",
      "logo": "images/institutions/chuk_miass-logo.jpg",
      "shortDescription": "Юридическое образование среднего уровня",
      "fullDescription": "Филиал ЧЮК готовит специалистов в области права.",
      "address": "456300, г. Миасс, ул. Академика Павлова, 17",
      "phone": "+7 (3513) 55-70-00",
      "website": "https://www.chuc.ru/",
      "specialties": ["Право и социальное обеспечение", "Правоохранительная деятельность", "Юриспруденция"],
      "gallery": ["images/institutions/chuk_miass-1.jpg", "images/institutions/chuk_miass-2.jpg", "images/institutions/chuk_miass-3.jpg"]
    },
    {
      "id": "mmcdt",
      "name": "Московский международный колледж цифровых технологий",
      "type": "college", "typeName": "Колледж",
      "logo": "images/institutions/mmcdt-logo.jpg",
      "shortDescription": "IT-образование и цифровые технологии",
      "fullDescription": "Современное учебное заведение, готовящее специалистов в области IT.",
      "address": "456304, г. Миасс, пр. Автозаводцев, 8",
      "phone": "+7 (3513) 55-80-00",
      "website": "https://topitcollege.ru/miass",
      "specialties": ["Информационные системы", "Веб-разработка", "Дизайн интерфейсов"],
      "gallery": ["images/institutions/mmcdt-1.jpg", "images/institutions/mmcdt-2.jpg", "images/institutions/mmcdt-3.jpg"]
    }
  ]
};

function loadInstitutions() {
    institutionsData = institutionsDataEmbedded;
    renderFilters();
    renderCards();
}

function renderFilters() {
    const c = document.getElementById('institutionsFilters');
    if (!c || !institutionsData) return;
    c.innerHTML = '';
    institutionsData.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat.id === currentFilter ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.dataset.filter = cat.id;
        btn.addEventListener('click', () => { currentFilter = cat.id; renderFilters(); renderCards(); });
        c.appendChild(btn);
    });
}

function renderCards() {
    const grid = document.getElementById('institutionsGrid');
    if (!grid || !institutionsData) return;
    grid.innerHTML = '';
    const filtered = currentFilter === 'all' ? institutionsData.institutions : institutionsData.institutions.filter(i => i.type === currentFilter);
    filtered.forEach(inst => {
        const card = document.createElement('div');
        card.className = 'institution-card';
        card.innerHTML = `<div class="institution-card-header">
            <img src="${inst.logo}" alt="${inst.name}" class="institution-logo">
            <div><h3 class="institution-card-title">${inst.name}</h3><span class="institution-card-type">${inst.typeName}</span></div>
        </div><div class="institution-card-body">
            <p class="institution-card-description">${inst.shortDescription}</p>
            <div class="institution-card-footer"><span class="institution-address">📍 ${inst.address}</span>
            <a href="${inst.website}" target="_blank" rel="noopener noreferrer" class="institution-card-link">Посетить сайт →</a></div>
        </div>`;
        card.addEventListener('click', () => openModal(inst.id));
        grid.appendChild(card);
    });
}

function openModal(id) {
    const inst = institutionsData.institutions.find(i => i.id === id);
    if (!inst) return;
    document.getElementById('modalLogo').src = inst.logo;
    document.getElementById('modalLogo').alt = inst.name;
    document.getElementById('modalTitle').textContent = inst.name;
    document.getElementById('modalType').textContent = inst.typeName;
    document.getElementById('modalDescription').textContent = inst.fullDescription;
    document.getElementById('modalAddress').textContent = inst.address;
    document.getElementById('modalPhone').textContent = inst.phone;
    const ws = document.getElementById('modalWebsite');
    ws.href = inst.website;
    ws.textContent = inst.website.replace(/^https?:\/\//, '');
    const sl = document.getElementById('modalSpecialties');
    sl.innerHTML = '';
    inst.specialties.forEach(s => { const li = document.createElement('li'); li.textContent = s; sl.appendChild(li); });
    const g = document.getElementById('modalGallery');
    g.innerHTML = '';
    inst.gallery.forEach(src => {
        const img = document.createElement('img');
        img.src = src; img.alt = inst.name; img.className = 'modal-gallery-img';
        img.addEventListener('click', () => window.open(src, '_blank'));
        g.appendChild(img);
    });
    document.getElementById('institutionModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('institutionModal').style.display = 'none';
    document.body.style.overflow = '';
}

function setupModalListeners() {
    const mc = document.getElementById('modalClose');
    const m = document.getElementById('institutionModal');
    if (mc) { mc.addEventListener('click', closeModal); }
    if (m) {
        m.querySelector('.modal-overlay').addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && m.style.display !== 'none') { closeModal(); } });
    }
}

function setupInstitutionsNavigation() {
    const link = document.querySelector('.nav-link[data-section="institutions"]');
    if (link) { link.addEventListener('click', () => { if (!institutionsData) { loadInstitutions(); } }); }
}

loadInstitutions();
setupModalListeners();
setupInstitutionsNavigation();

}); // End of DOMContentLoaded
