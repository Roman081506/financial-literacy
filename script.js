document.addEventListener('DOMContentLoaded', () => {
    // Budget Calculator
    const budgetCalculator = document.getElementById('budgetCalculator');
    const budgetResult = document.getElementById('budgetResult');

    budgetCalculator.addEventListener('submit', (e) => {
        e.preventDefault();
        const income = parseFloat(document.getElementById('income').value);
        const expenses = parseFloat(document.getElementById('expenses').value);

        if (isNaN(income) || isNaN(expenses)) {
            showResult(budgetResult, 'Пожалуйста, введите корректные значения', 'error');
            return;
        }

        const savings = income - expenses;
        const savingsPercentage = (savings / income) * 100;

        let message = `
            <h4>Результаты расчета:</h4>
            <p>Доход: ${formatMoney(income)}</p>
            <p>Расходы: ${formatMoney(expenses)}</p>
            <p>Сбережения: ${formatMoney(savings)} (${savingsPercentage.toFixed(1)}%)</p>
        `;

        if (savingsPercentage < 20) {
            message += '<p class="warning">Рекомендуется увеличить процент сбережений до 20%</p>';
        }

        showResult(budgetResult, message);
    });

    // Credit Calculator
    const creditCalculator = document.getElementById('creditCalculator');
    const creditResult = document.getElementById('creditResult');

    creditCalculator.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('interestRate').value);
        const term = parseInt(document.getElementById('loanTerm').value);

        if (isNaN(amount) || isNaN(rate) || isNaN(term)) {
            showResult(creditResult, 'Пожалуйста, введите корректные значения', 'error');
            return;
        }

        const monthlyRate = rate / 100 / 12;
        const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                             (Math.pow(1 + monthlyRate, term) - 1);
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - amount;

        const message = `
            <h4>Результаты расчета:</h4>
            <p>Ежемесячный платеж: ${formatMoney(monthlyPayment)}</p>
            <p>Общая сумма выплат: ${formatMoney(totalPayment)}</p>
            <p>Сумма процентов: ${formatMoney(totalInterest)}</p>
        `;

        showResult(creditResult, message);
    });

    // Savings Calculator
    const savingsCalculator = document.getElementById('savingsCalculator');
    const savingsResult = document.getElementById('savingsResult');

    savingsCalculator.addEventListener('submit', (e) => {
        e.preventDefault();
        const income = parseFloat(document.getElementById('monthlyIncome').value);
        const percentage = parseFloat(document.getElementById('savingsPercentage').value);

        if (isNaN(income) || isNaN(percentage)) {
            showResult(savingsResult, 'Пожалуйста, введите корректные значения', 'error');
            return;
        }

        const monthlySavings = income * (percentage / 100);
        const yearlySavings = monthlySavings * 12;
        const emergencyFund = income * 6; // 6 months of income
        const monthsToEmergencyFund = Math.ceil(emergencyFund / monthlySavings);

        const message = `
            <h4>Результаты расчета:</h4>
            <p>Ежемесячные сбережения: ${formatMoney(monthlySavings)}</p>
            <p>Годовые сбережения: ${formatMoney(yearlySavings)}</p>
            <p>Время до создания подушки безопасности: ${monthsToEmergencyFund} месяцев</p>
        `;

        showResult(savingsResult, message);
        updateProgressBar(monthlySavings, emergencyFund);
    });

    // Investment Calculator
    const investmentCalculator = document.getElementById('investmentCalculator');
    const investmentResult = document.getElementById('investmentResult');

    investmentCalculator.addEventListener('submit', (e) => {
        e.preventDefault();
        const initial = parseFloat(document.getElementById('initialAmount').value);
        const monthly = parseFloat(document.getElementById('monthlyInvestment').value);
        const rate = parseFloat(document.getElementById('expectedReturn').value);

        if (isNaN(initial) || isNaN(monthly) || isNaN(rate)) {
            showResult(investmentResult, 'Пожалуйста, введите корректные значения', 'error');
            return;
        }

        const monthlyRate = rate / 100 / 12;
        const years = 10;
        const months = years * 12;

        let total = initial;
        for (let i = 0; i < months; i++) {
            total = (total + monthly) * (1 + monthlyRate);
        }

        const totalInvested = initial + (monthly * months);
        const totalReturn = total - totalInvested;

        const message = `
            <h4>Результаты расчета (${years} лет):</h4>
            <p>Общая сумма инвестиций: ${formatMoney(totalInvested)}</p>
            <p>Доход от инвестиций: ${formatMoney(totalReturn)}</p>
            <p>Итоговая сумма: ${formatMoney(total)}</p>
        `;

        showResult(investmentResult, message);
    });

    // Security Quiz
    const quizOptions = document.querySelectorAll('.quiz-option');
    let quizAnswered = false;

    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (quizAnswered) return; // Prevent multiple selections
            
            quizAnswered = true;
            const isCorrect = option.textContent === 'Перезвонить в банк';
            
            // Disable all options
            quizOptions.forEach(opt => {
                opt.style.pointerEvents = 'none';
                if (opt.textContent === 'Перезвонить в банк') {
                    opt.classList.add('correct');
                }
            });

            // Style the selected option
            if (isCorrect) {
                option.classList.add('correct');
            } else {
                option.classList.add('incorrect');
            }
            
            const message = isCorrect ? 
                'Правильно! Всегда перезванивайте в банк по официальному номеру.' :
                'Неправильно! Правильный ответ: Перезвонить в банк. Всегда перезванивайте в банк по официальному номеру.';
            
            showNotification(message);
        });
    });

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        if (email) {
            showNotification('Спасибо за подписку! Проверьте вашу почту.');
            newsletterForm.reset();
        }
    });

    // Helper Functions
    function formatMoney(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(amount);
    }

    function showResult(element, message, type = 'success') {
        element.innerHTML = message;
        element.style.display = 'block';
        element.style.background = type === 'error' ? '#ffebee' : 'var(--light-bg)';
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function updateProgressBar(current, target) {
        const progress = document.querySelector('.progress');
        const percentage = Math.min((current / target) * 100, 100);
        progress.style.width = `${percentage}%`;
    }

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
