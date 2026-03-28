// ===== Wait for DOM to be ready =====
document.addEventListener('DOMContentLoaded', () => {

// ===== SPA Navigation =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function navigateToSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigation click handlers
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        navigateToSection(sectionId);
        
        // Reset tests section to list view
        if (sectionId === 'tests') {
            showTestsList();
        }
    });
});

// Hero button - navigate to tests
document.getElementById('heroBtn').addEventListener('click', () => {
    navigateToSection('tests');
    showTestsList();
});

// Test selection buttons from home page
document.querySelectorAll('.test-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const testId = btn.dataset.test;
        navigateToSection('tests');
        // Start the test directly
        setTimeout(() => {
            startTest(testId);
        }, 100);
    });
});

// ===== Test Management =====
const testsList = document.getElementById('testsList');
const testInterface = document.getElementById('testInterface');
const testResults = document.getElementById('testResults');

let currentTest = null;
let currentQuestionIndex = 0;
let answers = [];

// Placeholder test data (will be replaced with actual content)
const testsData = {
    klimov: {
        title: 'Методика Климова',
        totalQuestions: 30,
        questions: [
            {
                text: 'Пример вопроса 1: Вам нравится работать с людьми?',
                options: [
                    { text: 'Полностью согласен', value: 'nature', score: 1 },
                    { text: 'Скорее да', value: 'tech', score: 2 },
                    { text: 'Скорее нет', value: 'human', score: 3 },
                    { text: 'Полностью не согласен', value: 'signs', score: 4 }
                ]
            }
            // More questions will be added later
        ],
        results: {
            nature: {
                title: 'ЧЕЛОВЕК-ПРИРОДА',
                description: 'Вы предрасположены к работе с природными объектами: растениями, животными, микроорганизмами.',
                professions: ['Биолог', 'Ветеринар', 'Агроном', 'Эколог', 'Лесник']
            },
            tech: {
                title: 'ЧЕЛОВЕК-ТЕХНИКА',
                description: 'Вам подходит работа с техническими системами, механизмами и технологиями.',
                professions: ['Инженер', 'Программист', 'Механик', 'Электрик', 'Архитектор']
            },
            human: {
                title: 'ЧЕЛОВЕК-ЧЕЛОВЕК',
                description: 'Вы склонны к профессиям, связанным с общением и взаимодействием с людьми.',
                professions: ['Учитель', 'Психолог', 'Врач', 'Менеджер', 'Юрист']
            },
            signs: {
                title: 'ЧЕЛОВЕК-ЗНАКОВАЯ СИСТЕМА',
                description: 'Вам подходит работа с информацией, текстами, цифрами и символами.',
                professions: ['Бухгалтер', 'Программист', 'Переводчик', 'Аналитик', 'Редактор']
            },
            art: {
                title: 'ЧЕЛОВЕК-ХУДОЖЕСТВЕННЫЙ ОБРАЗ',
                description: 'Вы предрасположены к творческим профессиям и работе с искусством.',
                professions: ['Дизайнер', 'Художник', 'Музыкант', 'Актёр', 'Писатель']
            }
        }
    },
    holland: {
        title: 'Тест Холланда',
        totalQuestions: 15,
        questions: [
            {
                text: 'Пример вопроса 1: Вы любите работать руками?',
                options: [
                    { text: 'Да', value: 'realistic', score: 1 },
                    { text: 'Нет', value: 'investigative', score: 0 }
                ]
            }
            // More questions will be added later
        ],
        results: {
            realistic: {
                title: 'РЕАЛИСТИЧЕСКИЙ ТИП',
                description: 'Вы предпочитаете конкретную практическую деятельность с реальными объектами.',
                professions: ['Механик', 'Электрик', 'Инженер', 'Строитель', 'Водитель']
            },
            investigative: {
                title: 'ИССЛЕДОВАТЕЛЬСКИЙ ТИП',
                description: 'Вам нравится анализировать, исследовать и решать сложные задачи.',
                professions: ['Учёный', 'Аналитик', 'Программист', 'Исследователь', 'Математик']
            },
            artistic: {
                title: 'АРТИСТИЧЕСКИЙ ТИП',
                description: 'Вы склонны к творчеству, самовыражению и работе в свободной форме.',
                professions: ['Художник', 'Дизайнер', 'Музыкант', 'Писатель', 'Актёр']
            },
            social: {
                title: 'СОЦИАЛЬНЫЙ ТИП',
                description: 'Вам нравится помогать людям, обучать и взаимодействовать с ними.',
                professions: ['Учитель', 'Психолог', 'Социальный работник', 'Врач', 'Консультант']
            },
            enterprising: {
                title: 'ПРЕДПРИНИМАТЕЛЬСКИЙ ТИП',
                description: 'Вы склонны к лидерству, управлению и достижению целей.',
                professions: ['Менеджер', 'Предприниматель', 'Продавец', 'Политик', 'Маркетолог']
            },
            conventional: {
                title: 'СИСТЕМАТИЧЕСКИЙ ТИП',
                description: 'Вам подходит структурированная работа с данными и документами.',
                professions: ['Бухгалтер', 'Администратор', 'Секретарь', 'Библиотекарь', 'Архивариус']
            }
        }
    }
};

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
    currentTest = testsData[testId];
    currentQuestionIndex = 0;
    answers = [];
    
    showTestInterface();
    displayQuestion();
}

function displayQuestion() {
    const question = currentTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.totalQuestions) * 100;
    
    // Update progress bar
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent =
        `Вопрос ${currentQuestionIndex + 1} из ${currentTest.totalQuestions}`;
    
    // Update question
    document.getElementById('questionTitle').textContent = question.text;
    
    // Create answer options
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'answer-option';
        optionBtn.textContent = option.text;
        optionBtn.dataset.value = option.value;
        optionBtn.dataset.score = option.score;
        
        optionBtn.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.answer-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            optionBtn.classList.add('selected');
            
            // Enable next button
            document.getElementById('nextBtn').disabled = false;
        });
        
        answersContainer.appendChild(optionBtn);
    });
    
    // Disable next button until answer is selected
    document.getElementById('nextBtn').disabled = true;
}

// Next button handler
document.getElementById('nextBtn').addEventListener('click', () => {
    const selectedOption = document.querySelector('.answer-option.selected');
    
    if (selectedOption) {
        // Save answer
        answers.push({
            questionIndex: currentQuestionIndex,
            value: selectedOption.dataset.value,
            score: parseInt(selectedOption.dataset.score)
        });
        
        // Move to next question or show results
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentTest.totalQuestions) {
            displayQuestion();
        } else {
            calculateAndShowResults();
        }
    }
});

function calculateAndShowResults() {
    // Count scores for each category
    const scores = {};
    
    answers.forEach(answer => {
        if (!scores[answer.value]) {
            scores[answer.value] = 0;
        }
        scores[answer.value] += answer.score;
    });
    
    // Find category with highest score
    let maxScore = -1;
    let resultType = '';
    
    for (const [type, score] of Object.entries(scores)) {
        if (score >= maxScore) {
            maxScore = score;
            resultType = type;
        }
    }
    
    // Display results
    const result = currentTest.results[resultType];
    
    document.getElementById('resultsType').textContent = result.title;
    document.getElementById('resultsDescription').textContent = result.description;
    
    // Display professions list
    const professionsList = document.getElementById('professionsList');
    professionsList.innerHTML = '';
    
    result.professions.forEach(profession => {
        const li = document.createElement('li');
        li.textContent = profession;
        professionsList.appendChild(li);
    });
    
    showTestResults();
}

// Retake test button
document.getElementById('retakeBtn').addEventListener('click', () => {
    if (currentTest) {
        currentQuestionIndex = 0;
        answers = [];
        showTestInterface();
        displayQuestion();
    }
});

// Back to tests list button
document.getElementById('backToTestsBtn').addEventListener('click', () => {
    showTestsList();
    currentTest = null;
    currentQuestionIndex = 0;
    answers = [];
});

// Start test handlers - moved here to ensure all functions are defined
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
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Load saved theme or default to light
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

// Institutions data (embedded for local file compatibility)
// Пути к изображениям: images/institutions/{id}-logo.jpg, {id}-1.jpg, {id}-2.jpg, {id}-3.jpg
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
      "type": "branch",
      "typeName": "Филиал вуза",
      "logo": "images/institutions/miass_susu-logo.jpg",
      "shortDescription": "Ведущий технический университет Челябинской области",
      "fullDescription": "Филиал Южно-Уральского государственного университета (НИУ) в г. Миасс предлагает программы высшего образования по техническим и гуманитарным направлениям. Университет входит в число ведущих технических вузов России.",
      "address": "456318, г. Миасс, пр. Октября, 16",
      "phone": "+7 (3513) 55-00-00",
      "website": "http://www.miass.susu.ru/",
      "specialties": [
        "Прикладная информатика",
        "Менеджмент",
        "Экономика",
        "Юриспруденция",
        "Педагогическое образование",
        "Технология машиностроения"
      ],
      "gallery": [
        "images/institutions/miass_susu-1.jpg",
        "images/institutions/miass_susu-2.jpg",
        "images/institutions/miass_susu-3.jpg"
      ]
    },
    {
      "id": "miass_chelsu",
      "name": "Челябинский государственный университет, Миасский филиал",
      "type": "branch",
      "typeName": "Филиал вуза",
      "logo": "images/institutions/miass_chelsu-logo.jpg",
      "shortDescription": "Классическое университетское образование. Включает Колледж ЧелГУ",
      "fullDescription": "Миасский филиал Челябинского государственного университета предлагает программы бакалавриата, магистратуры и СПО. На базе филиала действует Колледж ЧелГУ.",
      "address": "г. Миасс, ул. Керченская, 1",
      "phone": "+7 (3513) 55-00-01",
      "website": "https://csu-miass.ru/",
      "specialties": [
        "Филология",
        "История",
        "Математика и информатика",
        "Биология",
        "Экономика и финансы",
        "Юриспруденция"
      ],
      "gallery": [
        "images/institutions/miass_chelsu-1.jpg",
        "images/institutions/miass_chelsu-2.jpg",
        "images/institutions/miass_chelsu-3.jpg"
      ]
    },
    {
      "id": "mgrk",
      "name": "Миасский геологоразведочный колледж",
      "type": "college",
      "typeName": "Колледж",
      "logo": "images/institutions/mgrk-logo.jpg",
      "shortDescription": "Единственный в регионе колледж геологоразведочного профиля",
      "fullDescription": "Миасский геологоразведочный колледж — уникальное учебное заведение, готовящее специалистов для геологоразведочной отрасли. Имеет несколько корпусов и буровой комплекс.",
      "address": "пр. Автозаводцев, 43; ул. Лихачёва, 15; ул. Ферсмана, 2а",
      "phone": "+7 (3513) 55-10-00",
      "website": "https://miassgrk.ru/",
      "specialties": [
        "Геологоразведка и разведка месторождений",
        "Бурение скважин",
        "Маркшейдерское дело",
        "Прикладная геология"
      ],
      "gallery": [
        "images/institutions/mgrk-1.jpg",
        "images/institutions/mgrk-2.jpg",
        "images/institutions/mgrk-3.jpg"
      ]
    },
    {
      "id": "mimk",
      "name": "Миасский машиностроительный колледж",
      "type": "college",
      "typeName": "Колледж",
      "logo": "images/institutions/mimk-logo.jpg",
      "shortDescription": "Подготовка специалистов для автомобильной отрасли",
      "fullDescription": "Миасский машиностроительный колледж готовит специалистов для работы на предприятиях автомобильной и машиностроительной отрасли. Тесно сотрудничает с автозаводом «Урал».",
      "address": "пр. Октября, 1; пр. Октября, 4; Предзаводская площадь, 1",
      "phone": "+7 (3513) 55-20-00",
      "website": "https://miassmk.ru/",
      "specialties": [
        "Технология машиностроения",
        "Автомобилестроение",
        "ТО и ремонт автомобильного транспорта",
        "Сварочное производство",
        "Мехатроника и робототехника"
      ],
      "gallery": [
        "images/institutions/mimk-1.jpg",
        "images/institutions/mimk-2.jpg",
        "images/institutions/mimk-3.jpg"
      ]
    },
    {
      "id": "mpk",
      "name": "Миасский педагогический колледж",
      "type": "college",
      "typeName": "Колледж",
      "logo": "images/institutions/mpk-logo.jpg",
      "shortDescription": "Подготовка учителей и воспитателей",
      "fullDescription": "Миасский педагогический колледж готовит специалистов для школ и детских садов. Особое внимание уделяется практической подготовке на базе школ-партнёров.",
      "address": "456316, г. Миасс, ул. Парковая, 2а",
      "phone": "+7 (3513) 55-30-00",
      "website": "https://miasspk.ru/",
      "specialties": [
        "Преподавание в начальных классах",
        "Дошкольное образование",
        "Коррекционная педагогика",
        "Физическая культура"
      ],
      "gallery": [
        "images/institutions/mpk-1.jpg",
        "images/institutions/mpk-2.jpg",
        "images/institutions/mpk-3.jpg"
      ]
    },
    {
      "id": "mmk",
      "name": "Миасский медицинский колледж",
      "type": "college",
      "typeName": "Колледж",
      "logo": "images/institutions/mmk-logo.jpg",
      "shortDescription": "Подготовка среднего медицинского персонала",
      "fullDescription": "Миасский медицинский колледж готовит медицинских сестёр, фельдшеров и фармацевтов. Оснащён современными лабораториями и тренажёрами.",
      "address": "456300, г. Миасс, ул. Романенко, 48",
      "phone": "+7 (3513) 55-40-00",
      "website": "https://miassmed.tmweb.ru/",
      "specialties": [
        "Сестринское дело",
        "Лечебное дело",
        "Фармация",
        "Лабораторная диагностика"
      ],
      "gallery": [
        "images/institutions/mmk-1.jpg",
        "images/institutions/mmk-2.jpg",
        "images/institutions/mmk-3.jpg"
      ]
    },
    {
      "id": "mgkik",
      "name": "Миасский государственный колледж искусства и культуры",
      "type": "college",
      "typeName": "Колледж",
      "logo": "images/institutions/mgkik-logo.jpg",
      "shortDescription": "Творческие профессии в сфере культуры",
      "fullDescription": "Колледж готовит специалистов для учреждений культуры, музыкальных школ и театров. Студенты участвуют в конкурсах и концертах.",
      "address": "пр. Автозаводцев, 10Б; ул. Орловская, 11",
      "phone": "+7 (3513) 55-50-00",
      "website": "https://колледжискусствмиасс.рф/",
      "specialties": [
        "Музыкальное искусство",
        "Народное художественное творчество",
        "Сольное и хоровое пение",
        "Инструментальное исполнительство"
      ],
      "gallery": [
        "images/institutions/mgkik-1.jpg",
        "images/institutions/mgkik-2.jpg",
        "images/institutions/mgkik-3.jpg"
      ]
    },
    {
      "id": "mst",
      "name": "Миасский строительный техникум",
      "type": "technikum",
      "typeName": "Техникум",
      "logo": "images/institutions/mst-logo.jpg",
      "shortDescription": "Подготовка специалистов для строительной отрасли",
      "fullDescription": "Техникум готовит специалистов для строительной отрасли. Студенты изучают современные технологии строительства и работу с профильным ПО.",
      "address": "г. Миасс, ул. Лихачёва, 15",
      "phone": "+7 (3513) 55-60-00",
      "website": "https://mst49.ru/",
      "specialties": [
        "Строительство и эксплуатация зданий",
        "Архитектура",
        "Мастер отделочных работ",
        "Землеустройство и кадастры"
      ],
      "gallery": [
        "images/institutions/mst-1.jpg",
        "images/institutions/mst-2.jpg",
        "images/institutions/mst-3.jpg"
      ]
    },
    {
      "id": "chuk_miass",
      "name": "Челябинский юридический колледж — филиал в г. Миассе",
      "type": "branch",
      "typeName": "Филиал колледжа",
      "logo": "images/institutions/chuk_miass-logo.jpg",
      "shortDescription": "Юридическое образование среднего уровня",
      "fullDescription": "Филиал ЧЮК готовит специалистов в области права. Выпускники работают в юридических консультациях, нотариальных конторах и госорганах.",
      "address": "456300, г. Миасс, ул. Академика Павлова, 17",
      "phone": "+7 (3513) 55-70-00",
      "website": "https://www.chuc.ru/",
      "specialties": [
        "Право и социальное обеспечение",
        "Правоохранительная деятельность",
        "Юриспруденция"
      ],
      "gallery": [
        "images/institutions/chuk_miass-1.jpg",
        "images/institutions/chuk_miass-2.jpg",
        "images/institutions/chuk_miass-3.jpg"
      ]
    },
    {
      "id": "mmcdt",
      "name": "Московский международный колледж цифровых технологий",
      "type": "college",
      "typeName": "Колледж",
      "logo": "images/institutions/mmcdt-logo.jpg",
      "shortDescription": "IT-образование и цифровые технологии",
      "fullDescription": "Современное учебное заведение, готовящее специалистов в области IT: программирование, веб-разработку, дизайн интерфейсов.",
      "address": "456304, г. Миасс, пр. Автозаводцев, 8",
      "phone": "+7 (3513) 55-80-00",
      "website": "https://topitcollege.ru/miass",
      "specialties": [
        "Информационные системы и программирование",
        "Веб-разработка",
        "Дизайн интерфейсов",
        "Компьютерные системы"
      ],
      "gallery": [
        "images/institutions/mmcdt-1.jpg",
        "images/institutions/mmcdt-2.jpg",
        "images/institutions/mmcdt-3.jpg"
      ]
    }
  ]
};

// Load institutions data (use embedded data for local file compatibility)
function loadInstitutions() {
    institutionsData = institutionsDataEmbedded;
    renderFilters();
    renderCards();
}

// Render filter buttons
function renderFilters() {
    const filtersContainer = document.getElementById('institutionsFilters');
    if (!filtersContainer || !institutionsData) return;
    
    filtersContainer.innerHTML = '';
    
    institutionsData.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${category.id === currentFilter ? 'active' : ''}`;
        btn.textContent = category.name;
        btn.dataset.filter = category.id;
        btn.addEventListener('click', () => {
            currentFilter = category.id;
            renderFilters();
            renderCards();
        });
        filtersContainer.appendChild(btn);
    });
}

// Render institution cards
function renderCards() {
    const grid = document.getElementById('institutionsGrid');
    if (!grid || !institutionsData) return;
    
    grid.innerHTML = '';
    
    const filtered = currentFilter === 'all'
        ? institutionsData.institutions
        : institutionsData.institutions.filter(inst => inst.type === currentFilter);
    
    filtered.forEach(inst => {
        const card = document.createElement('div');
        card.className = 'institution-card';
        card.innerHTML = `
            <div class="institution-card-header">
                <img src="${inst.logo}" alt="${inst.name}" class="institution-logo">
                <div>
                    <h3 class="institution-card-title">${inst.name}</h3>
                    <span class="institution-card-type">${inst.typeName}</span>
                </div>
            </div>
            <div class="institution-card-body">
                <p class="institution-card-description">${inst.shortDescription}</p>
                <div class="institution-card-footer">
                    <span class="institution-address">📍 ${inst.address}</span>
                    <a href="${inst.website}" target="_blank" rel="noopener noreferrer" class="institution-card-link">
                        Посетить сайт →
                    </a>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openModal(inst.id));
        grid.appendChild(card);
    });
}

// Open modal with institution details
function openModal(institutionId) {
    const institution = institutionsData.institutions.find(inst => inst.id === institutionId);
    if (!institution) return;
    
    const modal = document.getElementById('institutionModal');
    if (!modal) return;
    
    // Fill modal content
    document.getElementById('modalLogo').src = institution.logo;
    document.getElementById('modalLogo').alt = institution.name;
    document.getElementById('modalTitle').textContent = institution.name;
    document.getElementById('modalType').textContent = institution.typeName;
    document.getElementById('modalDescription').textContent = institution.fullDescription;
    document.getElementById('modalAddress').textContent = institution.address;
    document.getElementById('modalPhone').textContent = institution.phone;
    
    const websiteLink = document.getElementById('modalWebsite');
    websiteLink.href = institution.website;
    websiteLink.textContent = institution.website.replace(/^https?:\/\//, '');
    
    // Render specialties
    const specialtiesList = document.getElementById('modalSpecialties');
    specialtiesList.innerHTML = '';
    institution.specialties.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specialtiesList.appendChild(li);
    });
    
    // Render gallery
    const gallery = document.getElementById('modalGallery');
    gallery.innerHTML = '';
    institution.gallery.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = institution.name;
        img.className = 'modal-gallery-img';
        img.addEventListener('click', () => {
            // Optional: expand image in new tab
            window.open(imgSrc, '_blank');
        });
        gallery.appendChild(img);
    });
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('institutionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Setup modal listeners
function setupModalListeners() {
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('institutionModal');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                closeModal();
            }
        });
    }
}

// Initialize institutions when navigating to the section
function setupInstitutionsNavigation() {
    const institutionsLink = document.querySelector('.nav-link[data-section="institutions"]');
    if (institutionsLink) {
        institutionsLink.addEventListener('click', () => {
            // Load data if not already loaded
            if (!institutionsData) {
                loadInstitutions();
            }
        });
    }
}

// Initialize institutions functionality
loadInstitutions();
setupModalListeners();
setupInstitutionsNavigation();

}); // End of DOMContentLoaded
