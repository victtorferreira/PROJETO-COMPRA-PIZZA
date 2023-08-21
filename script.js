let modalKey = 0;
let cart = [];
let modalQt = 1;
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);



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
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
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
    }
    
});

c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=> {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        e.target.classList.add('selected');
    })
   
});

c('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt (c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let indentifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=> item.indentifier == indentifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    }else {
        cart.push({
            indentifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();

    function updateCart() {
        if(cart.length > 0) {
            c('aside').classList.add('show');
            c('.cart').innerHTML = '';
            for(let i in cart) {
                let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
                let cartItem = c('.cart--item').cloneNode(true);

                let pizzaSizeName;
                switch(cart[i].size) {
                    case 0:
                        pizzaSizeName = 'P';
                        break;
                    case 1:
                        pizzaSizeName = 'M';
                        break;
                    case 2:
                        pizzaSizeName = 'G';
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




        }else {
            c('aside').classList.remove('show');
        }
    }
})

