// zamknięcie i otwarcie koszyka 
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
// otwarcie
cartIcon.onclick = () => {
    cart.classList.add("active");
}
//zamknięcie
closeCart.onclick = () => {
    cart.classList.remove("active");
}
// Dodawanie do koszyka
// Koszyk działa z JS
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
}else{
    ready();
}

//Funkcjonalność

function ready() {
    //usuwanie z koszyka
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i< removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem)
    }
    // Zmiana ilości
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i< quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged)
    }
    // Dodawanie do koszyka
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i< addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked)
    }
    loadCartItems();
}

// Usuwanie 
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems ();
    updateCartIcon();
}
// Zmiana ilości
function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateTotal();
    saveCartItems ();
    updateCartIcon();
}

// dodawanie do koszyka
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems ();
    updateCartIcon();
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
      if (cartItemsNames[i].innerText == title) {
        alert('Już dodałeś ten produkt do koszyka');
        return;
      }
    }
    var cartBoxContent = `
      <img src="${productImg}" alt="" class="cart-image">
      <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" name="" id="" value="1" class="cart-quantity">
      </div>
      <!--Usuwanie z Koszyka-->
      <i class='bx bx-trash cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0]
      .addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0]
      .addEventListener('change', quantityChanged);
      saveCartItems ();
      updateCartIcon();
      
  }

//Aktulizowanie total

function updateTotal(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for(var i =0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('zł', ''))
        var quantity = quantityElement.value;
        total+= price * quantity;
    }
    //kiedy cena jest po przecinku
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = total + " zł"
    // zapis total
    localStorage.setItem('cartTotal', total);
    
}

//zostawianie rzeczy po odświeżeniu z localstorage
function saveCartItems() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];
  
    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
      var priceElement = cartBox.getElementsByClassName("cart-price")[0];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      var productImg = cartBox.getElementsByClassName("cart-image")[0].src;
  
      var item = {
        title: titleElement.innerText,
        price: priceElement.innerText,
        quantity: quantityElement.value,
        productImg: productImg,
      };
  
      cartItems.push(item);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
  
// zaladowanie koszyka
function loadCartItems () {
    
    var cartItems = localStorage.getItem('cartItems');
    if(cartItems) {
        cartItems = JSON.parse(cartItems);

        for (var i= 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);
            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
}
}
var cartTotal = localStorage.getItem('cartTotal');
if(cartTotal) {
    document.getElementsByClassName('total-price')[0].innerText = cartTotal + "zł";
}
updateCartIcon();
}
// ilość w koszyku
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
      quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector("#cart-icon"); // Poprawne pobranie elementu ikony koszyka
    cartIcon.setAttribute('data-quantity', quantity);
  }
  