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
    let maxScore = 0;
    let resultType = '';
    
    for (const [type, score] of Object.entries(scores)) {
        if (score > maxScore) {
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

}); // End of DOMContentLoaded
