
    function clearStylesAndError() {
    error.textContent = "";
    input_login.classList.remove('invalid', 'valid');
}
function validateAndSubmit() {
    clearStylesAndError();
    const name = input_login.value.trim();
    if (!name) {
        error.textContent = "Введите имя!";
        input_login.classList.add('invalid');
        return;
    }
    if (name.length < 2 || name.lenght > 30) {
        error.textContent = "";
        input_login.classList.add('invalid');
        return;
    }
}

// button.addEventListener('click',validateAndSubmit)

// input_login.addEventListener('keydown', (e)=>{
//     if (e.key === 'Enter') validateAndSubmit();
// })
// input_login.addEventListener('input_login',clearStylesAndError)







document.addEventListener('DOMContentLoaded', function () {
    // Получаем элементы
    const loginInput = document.getElementById('loginInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const submitBtn = document.getElementById('submitBtn');

    // Проверяем, что элементы существуют
    if (!loginInput || !submitBtn) {
        console.error('Элементы не найдены! Проверьте ID');
        return;
    }

    console.log('Скрипт загружен, элементы найдены');

    // Функция очистки ошибок
    function clearErrors() {
        loginError.textContent = '';
        passwordError.textContent = '';
        loginInput.classList.remove('invalid', 'valid');
    }

    // Валидация логина
    function validateLogin() {
        const login = loginInput.value.trim();

        if (!login) {
            loginError.textContent = 'Введите логин!';
            loginInput.classList.add('invalid');
            return false;
        }

        if (login.length < 3 || login.length > 20) {
            loginError.textContent = 'Логин должен быть от 3 до 20 символов';
            loginInput.classList.add('invalid');
            return false;
        }

        loginInput.classList.remove('invalid');
        loginInput.classList.add('valid');
        return true;
    }

    // Валидация пароля
    function validatePassword() {
        const password = passwordInput.value;

        if (!password) {
            passwordError.textContent = 'Введите пароль!';
            return false;
        }

        if (password.length < 6) {
            passwordError.textContent = 'Пароль должен быть не менее 6 символов';
            return false;
        }

        return true;
    }

    // Основная функция валидации
    function validateForm() {
        clearErrors();

        const isLoginValid = validateLogin();
        const isPasswordValid = validatePassword();

        if (isLoginValid && isPasswordValid) {
            // Все ок - можно отправлять форму
            alert('Форма валидна! Отправляем данные...');
            // Здесь будет отправка формы на сервер
            // window.location.href = 'index_auth.html';
            return true;
        }

        return false;
    }

    // Обработчик для кнопки
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем переход по ссылке
        console.log('Кнопка нажата');
        validateForm();
    });

    // Валидация при вводе
    loginInput.addEventListener('input', function () {
        const value = this.value.trim();
        if (value.length > 0) {
            // Проверяем только если что-то введено
            if (value.length >= 3 && value.length <= 20) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                loginError.textContent = '';
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
            }
        } else {
            this.classList.remove('invalid', 'valid');
            loginError.textContent = '';
        }
    });

    // Валидация по нажатию Enter
    loginInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateForm();
        }
    });

    passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateForm();
        }
    });

    // Для отладки - проверяем, что обработчики установлены
    console.log('Обработчики установлены');
});









// Класс для управления корзиной
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || {};
        this.initEventListeners();
        this.updateAllCounters();
    }
    
    // Генерируем уникальный ID для товара
    generateItemId(name, size = null) {
        return `${name}_${size || 'no-size'}`;
    }
    
    // Добавляем товар в корзину
    addToCart(name, price, size = null) {
        const itemId = this.generateItemId(name, size);
        
        if (this.cart[itemId]) {
            this.cart[itemId].quantity += 1;
        } else {
            this.cart[itemId] = {
                name: name,
                price: parseInt(price.replace(/\D/g, '')),
                size: size,
                quantity: 1
            };
        }
        
        this.saveCart();
        this.updateCounter(itemId);
        return this.cart[itemId].quantity;
    }
    
    // Уменьшаем количество товара
    decreaseQuantity(name, size = null) {
        const itemId = this.generateItemId(name, size);
        
        if (this.cart[itemId]) {
            this.cart[itemId].quantity -= 1;
            
            if (this.cart[itemId].quantity <= 0) {
                delete this.cart[itemId];
            }
            
            this.saveCart();
            this.updateCounter(itemId);
        }
        
        return this.cart[itemId] ? this.cart[itemId].quantity : 0;
    }
    
    // Увеличиваем количество товара
    increaseQuantity(name, size = null) {
        const itemId = this.generateItemId(name, size);
        
        if (this.cart[itemId]) {
            this.cart[itemId].quantity += 1;
            this.saveCart();
            this.updateCounter(itemId);
        }
        
        return this.cart[itemId] ? this.cart[itemId].quantity : 0;
    }
    
    // Получаем текущее количество товара
    getQuantity(name, size = null) {
        const itemId = this.generateItemId(name, size);
        return this.cart[itemId] ? this.cart[itemId].quantity : 0;
    }
    
    // Сохраняем корзину в localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    // Обновляем счетчик для конкретного товара
    updateCounter(itemId) {
        const item = this.cart[itemId];
        if (!item) return;
        
        // Находим все карточки с этим товаром
        document.querySelectorAll('[class*="card"]').forEach(card => {
            const nameElement = card.querySelector('[class*="card-name"]');
            if (!nameElement) return;
            
            const name = nameElement.textContent;
            let size = null;
            
            // Проверяем размер (для напитков)
            const activeSizeBtn = card.querySelector('.size-btn.active');
            if (activeSizeBtn) {
                size = activeSizeBtn.textContent.toLowerCase();
            }
            
            const currentItemId = this.generateItemId(name, size);
            
            if (currentItemId === itemId) {
                this.updateCardCounter(card, item.quantity);
            }
        });
    }
    
    // Обновляем все счетчики при загрузке страницы
    updateAllCounters() {
        document.querySelectorAll('[class*="card"]').forEach(card => {
            const nameElement = card.querySelector('[class*="card-name"]');
            if (!nameElement) return;
            
            const name = nameElement.textContent;
            let size = null;
            
            // Проверяем размер (для напитков)
            const activeSizeBtn = card.querySelector('.size-btn.active');
            if (activeSizeBtn) {
                size = activeSizeBtn.textContent.toLowerCase();
            }
            
            const quantity = this.getQuantity(name, size);
            
            if (quantity > 0) {
                this.updateCardCounter(card, quantity);
            }
        });
    }
    
    // Обновляем внешний вид карточки
    updateCardCounter(card, quantity) {
        const addButton = card.querySelector('.backetBut');
        if (!addButton) return;
        
        if (quantity === 0) {
            // Показываем обычную кнопку "В корзину"
            addButton.innerHTML = 'В корзину';
            addButton.style.display = 'block';
            
            // Удаляем контейнер счетчика, если он есть
            const counterContainer = card.querySelector('.quantity-counter');
            if (counterContainer) {
                counterContainer.remove();
            }
        } else {
            // Скрываем обычную кнопку
            addButton.style.display = 'none';
            
            // Создаем или обновляем контейнер счетчика
            let counterContainer = card.querySelector('.quantity-counter');
            if (!counterContainer) {
                counterContainer = document.createElement('div');
                counterContainer.className = 'quantity-counter';
                addButton.parentNode.appendChild(counterContainer);
            }
            
            // Обновляем содержимое счетчика (без надписи "удалить")
            counterContainer.innerHTML = `
                <button class="counter-btn minus">-</button>
                <span class="counter-value">${quantity}</span>
                <button class="counter-btn plus">+</button>
            `;
            
            // Добавляем обработчики для новых кнопок
            this.addCounterEventListeners(counterContainer, card);
        }
    }
    
    // Добавляем обработчики для кнопок счетчика
    addCounterEventListeners(counterContainer, card) {
        const nameElement = card.querySelector('[class*="card-name"]');
        const name = nameElement.textContent;
        
        // Кнопка уменьшения количества
        const minusBtn = counterContainer.querySelector('.minus');
        minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let size = null;
            const activeSizeBtn = card.querySelector('.size-btn.active');
            if (activeSizeBtn) {
                size = activeSizeBtn.textContent.toLowerCase();
            }
            
            this.decreaseQuantity(name, size);
        });
        
        // Кнопка увеличения количества
        const plusBtn = counterContainer.querySelector('.plus');
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let size = null;
            const activeSizeBtn = card.querySelector('.size-btn.active');
            if (activeSizeBtn) {
                size = activeSizeBtn.textContent.toLowerCase();
            }
            
            this.increaseQuantity(name, size);
        });
    }
    
    // Инициализируем обработчики событий
    initEventListeners() {
        // Обработчики для кнопок "В корзину"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('backetBut') && e.target.textContent === 'В корзину') {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target;
                const card = button.closest('[class*="card"]');
                const nameElement = card.querySelector('[class*="card-name"]');
                const priceElement = card.querySelector('[class*="price"]');
                
                if (nameElement && priceElement) {
                    const name = nameElement.textContent;
                    const priceText = priceElement.textContent;
                    
                    // Определяем размер
                    let size = null;
                    const activeSizeBtn = card.querySelector('.size-btn.active');
                    if (activeSizeBtn) {
                        size = activeSizeBtn.textContent.toLowerCase();
                    }
                    
                    // Добавляем товар в корзину
                    const quantity = this.addToCart(name, priceText, size);
                    
                    // Анимация кнопки
                    button.classList.add('added-animation');
                    setTimeout(() => {
                        button.classList.remove('added-animation');
                    }, 300);
                }
            }
        });
        
        // Обработчики для кнопок размера
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const sizeBtn = e.target;
                const container = sizeBtn.closest('.size-price, .size-priceC');
                
                if (container) {
                    // Убираем активный класс у всех кнопок в контейнере
                    container.querySelectorAll('.size-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Добавляем активный класс нажатой кнопке
                    sizeBtn.classList.add('active');
                    
                    // Обновляем счетчик для нового размера
                    const card = sizeBtn.closest('[class*="card"]');
                    const nameElement = card.querySelector('[class*="card-name"]');
                    if (nameElement) {
                        const name = nameElement.textContent;
                        const newSize = sizeBtn.textContent.toLowerCase();
                        const oldSize = this.getPreviousActiveSize(container, sizeBtn);
                        
                        // Если товар уже был в корзине со старым размером, обновляем его
                        if (oldSize !== newSize) {
                            const oldQuantity = this.getQuantity(name, oldSize);
                            if (oldQuantity > 0) {
                                // Переносим количество на новый размер
                                const itemIdOld = this.generateItemId(name, oldSize);
                                const itemIdNew = this.generateItemId(name, newSize);
                                
                                if (this.cart[itemIdOld]) {
                                    this.cart[itemIdNew] = {
                                        ...this.cart[itemIdOld],
                                        size: newSize
                                    };
                                    delete this.cart[itemIdOld];
                                    this.saveCart();
                                    this.updateCardCounter(card, this.cart[itemIdNew].quantity);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Получаем предыдущий активный размер
    getPreviousActiveSize(container, currentBtn) {
        const allSizeBtns = container.querySelectorAll('.size-btn');
        for (const btn of allSizeBtns) {
            if (btn !== currentBtn && btn.classList.contains('active')) {
                return btn.textContent.toLowerCase();
            }
        }
        return null;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const cartManager = new CartManager();
    
    // Инициализация активных размеров по умолчанию
    // Для сезонных напитков и пышек - размер M
    document.querySelectorAll('.MenuSpecDrinks .size-m, .MenuPushki .size-m').forEach(btn => {
        btn.classList.add('active');
    });
    
    // Для кофейных напитков - размер S
    document.querySelectorAll('.MenuCoffe .cnopcSize .size-s').forEach(btn => {
        btn.classList.add('active');
    });
    
    // Добавляем класс size-btn ко всем кнопкам размера
    document.querySelectorAll('.size-s, .size-sm, .size-m').forEach(btn => {
        btn.classList.add('size-btn');
    });
});

















// Адаптивное меню для телефонов
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const isAuth = document.querySelector('.nav_auth');
    
    // Создаем мобильное меню
    function createMobileMenu() {
        // Если меню уже есть, удаляем старое
        const existingMenu = document.querySelector('.mobile-menu');
        const existingOverlay = document.querySelector('.menu-overlay');
        
        if (existingMenu) existingMenu.remove();
        if (existingOverlay) existingOverlay.remove();
        
        let mobileMenuHTML = `
            <div class="mobile-menu">
                <div class="mobile-menu-header">
                    <img class="mobile-logo" src="web/img/1.svg" alt="логотип"/>
                    <button class="close-menu" aria-label="Закрыть меню">×</button>
                </div>
        `;
        
        if (isAuth) {
            mobileMenuHTML += `
                <div class="mobile-profile">
                    <div class="mobile-profile-avatar">
                      <a href=profile.html>  <img src="web/img/profile.svg" alt="профиль"></a>
                    </div>
                    <div class="mobile-profile-info">
                        <h4>Пышкин Пыша Пышкович</h4>
                    </div>
                    
                </div>
                <ul class="mobile-nav-list">
                    <li><a href="index_auth.html" class="nav_link">Главная</a></li>
                    <li><a href="menu_auth.html" class="nav_link">Меню</a></li>
                    <li><a href="basket.html" clalass="nav_link">Корзина</a> </li>
                </ul>
               
                <div class="mobile-auth-section">
                    <a href="index.html" class="mobile-auth-link">Выйти</a>
                </div>
            `;
        } else {
            mobileMenuHTML += `
                <ul class="mobile-nav-list">
                    <li><a href="index.html" class="nav_link">Главная</a></li>
                    <li><a href="menu.html" class="nav_link_active">Меню</a></li>
                </ul>
                <div class="mobile-auth-section">
                    <a href="auth.html" class="mobile-auth-link">Вход</a>
                </div>
            `;
        }
        
        mobileMenuHTML += `</div><div class="menu-overlay"></div>`;
        document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
        
        initMenuEvents();
    }
    
    // Инициализация событий
    function initMenuEvents() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const closeBtn = document.querySelector('.close-menu');
        const overlay = document.querySelector('.menu-overlay');
        
        function openMenu() {
            navToggle.classList.add('active');
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
        }
        
        function closeMenu() {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        
        // Открытие
        navToggle.addEventListener('click', openMenu);
        
        // Закрытие
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        
        // Закрытие при клике на ссылку
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => setTimeout(closeMenu, 300));
        });
        
        // ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // Проверка размера экрана
    function checkScreenSize() {
        if (window.innerWidth <= 767) {
            createMobileMenu();
        } else {
            // Удаляем меню на десктопе
            const mobileMenu = document.querySelector('.mobile-menu');
            const overlay = document.querySelector('.menu-overlay');
            
            if (mobileMenu) mobileMenu.remove();
            if (overlay) overlay.remove();
            
            if (navToggle) navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Инициализация
    checkScreenSize();
    
    // Ресайз
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkScreenSize, 250);
    });
});



































