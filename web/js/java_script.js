

// button.addEventListener('click',validateAndSubmit)

// input_login.addEventListener('keydown', (e)=>{
//     if (e.key === 'Enter') validateAndSubmit();
// })
// input_login.addEventListener('input_login',clearStylesAndError)








   


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
                    <li><a href="menu.html" class="nav_link">Меню</a></li>
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

document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
          const isMinus = this.classList.contains('minus-btn');
          const quantityValue = this.parentElement.querySelector('.quantity-value');
          let currentValue = parseInt(quantityValue.textContent);
          
          if (isMinus && currentValue > 1) {
            quantityValue.textContent = currentValue - 1;
          } else if (!isMinus) {
            quantityValue.textContent = currentValue + 1;
          }
          
          updateTotalPrice();
        });
      });
      
      // Удаление товара
      document.querySelectorAll('.item-remove').forEach(button => {
        button.addEventListener('click', function() {
          const cartItem = this.closest('.cart-item');
          cartItem.style.transform = 'translateX(-100%)';
          cartItem.style.opacity = '0';
          setTimeout(() => {
            cartItem.remove();
            updateTotalPrice();
          }, 300);
        });
      });
      
      // Выбор способа доставки
      document.querySelectorAll('.delivery-option').forEach(option => {
        option.addEventListener('click', function() {
          document.querySelectorAll('.delivery-option').forEach(opt => {
            opt.classList.remove('active');
            const input = opt.querySelector('input');
            if (input) input.disabled = true;
          });
          
          this.classList.add('active');
          const input = this.querySelector('input');
          if (input) input.disabled = false;
        });
      });
      
      // Выбор способа оплаты
      document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
          document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('active');
          });
          this.classList.add('active');
        });
      });
      
      // Обновление итоговой суммы
      function updateTotalPrice() {
        let total = 0;
        let itemCount = 0;
        
        document.querySelectorAll('.cart-item').forEach(item => {
          const quantity = parseInt(item.querySelector('.quantity-value').textContent);
          const priceText = item.querySelector('.item-price').textContent;
          const price = parseInt(priceText.replace(/[^\d]/g, ''));
          
          total += price * quantity;
          itemCount += quantity;
        });
        
        // Обновляем количество товаров
        const itemCountElement = document.querySelector('.summary-row:first-child span:first-child');
        if (itemCountElement) {
          itemCountElement.textContent = `${itemCount} ${getCorrectWordForm(itemCount, ['товар', 'товара', 'товаров'])}`;
        }
        
        // Обновляем итоговую сумму
        const totalElement = document.querySelector('.summary-total span:last-child');
        if (totalElement) {
          totalElement.textContent = `${total} ₽`;
        }
        
        // Обновляем промежуточную сумму
        const subtotalElement = document.querySelector('.summary-row:first-child span:last-child');
        if (subtotalElement) {
          subtotalElement.textContent = `${total} ₽`;
        }
      }
      
      // Функция для правильного склонения слов
      function getCorrectWordForm(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
      }
      
      // Инициализация при загрузке
 /* Контейнер корзины */
      .basket-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 40px;
      }
      
      .basket-items {
        flex: 1;
        min-width: 300px;
      }
      
      .order-summary {
        width: 100%;
        max-width: 400px;
        background-color: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      }
      
      .cart-item {
        background-color: white;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      
      .item-image {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        object-fit: cover;
        margin-right: 20px;
      }
      
      .item-details {
        flex: 1;
        min-width: 200px;
      }
      
      .item-title {
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 5px;
        color: var(--dark-color);
      }
      
      .item-description {
        color: #666;
        margin-bottom: 8px;
        font-size: 14px;
      }
      
      .item-size {
        display: inline-block;
        background-color: var(--light-color);
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 14px;
        color: var(--dark-color);
        margin-bottom: 10px;
      }
      
      .item-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 25px;
        overflow: hidden;
      }
      
      .quantity-btn {
        background-color: #f8f8f8;
        border: none;
        width: 40px;
        height: 40px;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .quantity-btn:hover {
        background-color: #eee;
      }
      
      .quantity-value {
        width: 50px;
        text-align: center;
        font-weight: 600;
      }
      
      .item-price {
        font-weight: 700;
        font-size: 22px;
        color: var(--primary-color);
      }
      
      .item-remove {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 14px;
        transition: color 0.2s;
      }
      
      .item-remove:hover {
        color: #ff5555;
      }
      
      /* Секция итогов */
      .summary-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--dark-color);
        margin-bottom: 25px;
        text-align: center;
      }
      
      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #eee;
      }
      
      .summary-total {
        font-size: 26px;
        font-weight: 800;
        color: var(--primary-color);
        margin-top: 10px;
        padding-top: 15px;
        border-top: 2px solid var(--accent-color);
      }
      
      .delivery-section, .payment-section {
        margin-top: 25px;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: var(--dark-color);
      }
      
      .delivery-option {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px 15px;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .delivery-option:hover {
        background-color: #f9f9f9;
      }
      
      .delivery-option.active {
        background-color: var(--light-color);
        border: 1px solid var(--accent-color);
      }
      
      .delivery-icon {
        margin-right: 10px;
        color: var(--primary-color);
        font-size: 18px;
      }
      
      .address-input {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin-top: 10px;
        font-size: 16px;
      }
      
      .payment-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .payment-option {
        flex: 1;
        min-width: 120px;
        text-align: center;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .payment-option:hover {
        border-color: var(--accent-color);
      }
      
      .payment-option.active {
        border-color: var(--primary-color);
        background-color: var(--light-color);
      }
      
      .payment-icon {
        font-size: 24px;
        margin-bottom: 8px;
        color: var(--primary-color);
      }
      
     
      
      .main-button {
        background-color: var(--primary-color);
        color: #502C13;
        border: none;
        padding: 18px 60px;
        font-size: 20px;
        font-weight: 700;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s;
      
      }
      
      .main-button:hover {
        background-color: var(--dark-color);
        transform: translateY(-3px);
        
      }
      
      .main-button:active {
        transform: translateY(0);
      }
      
      /* Футер */
      
      
      /* Адаптивность */
      @media (max-width: 992px) {
        .basket-container {
          flex-direction: column;
        }
        
        .order-summary {
          max-width: 100%;
        }
        
        .info_address {
          flex-direction: column;
        }
        
        .logoFooter {
            margin-top: 45px;
          margin-bottom: 20px;
          width: 69px;
          height: 69px;
        }
        
        .namTel {
          margin-right: 0;
          margin-bottom: 25px;
        }
      }
      
      @media (max-width: 768px) {
        .navbar-custom {
          flex-wrap: wrap;
        }
        
        .nav_auth {
          order: 3;
          width: 100%;
          justify-content: center;
          margin-top: 15px;
        }
        
        .right_header {
          order: 2;
        }
        
        .cart-item {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .item-image {
          margin-right: 0;
          margin-bottom: 15px;
        }
        
        .item-controls {
          width: 100%;
        }
        
        .copyr_rights {
          flex-direction: column;
          text-align: center;
          gap: 10px;
        }
      }
      
      @media (max-width: 576px) {
        .basket_n {
          font-size: 28px;
        }
        
        .item-title {
          font-size: 18px;
        }
        
        .main-button {
          width: 100%;
          padding: 16px 30px;
        }
        
        .payment-options {
          flex-direction: column;
        }
      }







