let modalKey = 0;
let cart = [];
let modalQt = 1;
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

function calculatePizzaPrice() {
    const selectedSize = c('.pizzaInfo--size.selected');
    if (!selectedSize) {
        return 0; // Return 0 if no size is selected
    }

    const newSizeKey = selectedSize.getAttribute('data-key');
    
    const selectedPizza = pizzaJson[modalKey];

    
    if (selectedPizza) {
        // c('.pizzaInfo--qt').innerHTML = 1
        let newSizePrice = selectedPizza.sizes[newSizeKey];
        let totalPrice = newSizePrice * modalQt;
        
        
        return totalPrice
    }
    
}






pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;   
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        c( '.pizzaInfo--size.selected').classList.remove('selected');
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c( '.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
       
        cs('.pizzaInfo--size').forEach((size) => {
            size.addEventListener('click', (e) => {
                 c('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
        
                const newSizeKey = size.getAttribute('data-key');
                const selectedPizza = pizzaJson[modalKey];
                if(selectedPizza && selectedPizza.sizes[newSizeKey]) {
                    const newSizePrice = selectedPizza.sizes[newSizeKey];
                    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${newSizePrice.toFixed(2)}`;
                    const totalPrice = calculatePizzaPrice();
                }       
            });
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });


    c ('.pizza-area').append(pizzaItem);
});


//EVENTOS DO MODAL


function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1) {
        modalQt--;
     c('.pizzaInfo--qt').innerHTML = modalQt;
     const totalPrice = calculatePizzaPrice();
     c('.pizzaInfo--actualPrice').innerHTML = `R$ ${totalPrice.toFixed(2)}`;
    }
    
});

c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    const totalPrice = calculatePizzaPrice();
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${totalPrice.toFixed(2)}`;
});

cs('.pizzaInfo--size').forEach((sizes, sizeIndex) => {
    sizes.addEventListener('click', (e) => {
        const selectedSize = c('.pizzaInfo--size.selected');
        if (selectedSize) {
            selectedSize.classList.remove('selected');
        }
        e.target.classList.add('selected');

        const newSizeKey = e.target.getAttribute('data-key');
        const selectedPizza = pizzaJson[modalKey];
        if (selectedPizza && selectedPizza.sizes[newSizeKey]) {
            const newSizePrice = selectedPizza.sizes[newSizeKey];
            const totalPrice = calculatePizzaPrice();
            c('.pizzaInfo--actualPrice').innerHTML = `R$ ${totalPrice.toFixed(2)}`;
            
           // c('.pizzaInfo--totalPrice').innerHTML = `total ${totalPrice.toFixed(2)}`; // Calcula o preço total
            // Fazer algo com o preço total, como exibi-lo na interface
        }
    });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let sizes = parseInt (c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let indentifier = pizzaJson[modalKey].id+'@'+sizes;

    let key = cart.findIndex((item)=> item.indentifier == indentifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    }else {
        cart.push({
            indentifier,
            id:pizzaJson[modalKey].id,
            sizes,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();

    c('.menu-openner').addEventListener('click',() => {
        if(cart.length > 0) {
            c('aside').style.left = '0';
        }
    })

    c('.menu-closer').addEventListener('click', ()=> {
        c('aside').style.left = '100vw';
    })


    function updateCart() {

        c('.menu-openner span').innerHTML = cart.length;

        if(cart.length > 0) {
            c('aside').classList.add('show');
            c('.cart').innerHTML = '';

            let subtotal = 0; 
            let desconto = 0;
            let total = 0;

            for(let i in cart) {
                let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
                subtotal += pizzaItem.price * cart[i].qt;
                let cartItem = c('.models .cart--item').cloneNode(true);
                
                let pizzaSizeName;
                switch (cart[i].sizes) {
                    case 0:
                        pizzaSizeName = 'P';
                        break;
                    case 1:
                        pizzaSizeName = 'M';
                        break;
                    case 2:
                        pizzaSizeName = 'G';
                        break;
                    default:
                        pizzaSizeName = 'Tamanho Desconhecido';
                        break;
                        
                }
                

                let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
                cartItem.querySelector('img').src = pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                    if(cart[i].qt > 1) {
                        cart[i].qt--;
                    }else {
                        cart.splice(i, 1);
                    }
                    updateCart();
                });


                cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                    cart[i].qt++;
                    updateCart();
                });


                c('.cart').append(cartItem);

            }

            desconto = subtotal * 0.1;
            total = subtotal - desconto;
            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`; 
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


        }else {
            c('aside').classList.remove('show');
            c('aside').style.left = '100vw';
        }
    }


    
})

