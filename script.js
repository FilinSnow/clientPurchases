let arrShopping = [];
let whereWasBuy = document.querySelector('.buy__input input');
let amountWasBuy = document.querySelector('.count__buy-input input');
let valueInputWasBuy = '';
let valueInputAmountWasBuy = '';
// const addBuyCart = document.querySelector('.create__button button');
const containerTasks = document.querySelector('.container__tasks');
let amount = document.querySelector('.amount span');
let sumPurchases = 0;

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();
const newDate = `${("0" + day).slice(-2)}.${("0" + month).slice(-2)}.${year}`;

window.onload = function () {
  render();
}

const render = async () => {
  sumPurchases = 0;
  const response = await fetch('http://localhost:8000/getPurchases',
    {
      method: 'GET'
    }
  )
  const result = await response.json();
  arrShopping = result.data || ['asd']
  containerTasks.innerHTML = '';
  let countBeforeItem = 1;
  arrShopping.map(item => {
    //containerPurchase
    const containerPurchase = document.createElement('div');
    containerPurchase.className = 'container__purchase';

    //containerTextDate
    const containerTextDate = document.createElement('div');
    containerTextDate.className = 'container__text-date';
    //num before item
    const divNum = document.createElement('div');
    divNum.innerHTML = `${countBeforeItem})`;
    containerTextDate.appendChild(divNum);
    //textDiv
    const textDiv = document.createElement('div');
    textDiv.innerHTML = `${item.text}`;
    //inputForText
    let inputForText = document.createElement('input');
    inputForText.className = 'inp hidden';
    inputForText.placeholder = 'Куда было потрачено';
    //dateDiv
    const dateDiv = document.createElement('div');
    dateDiv.innerHTML = item.date;
    // inputForDate
    let inputForDate = document.createElement('input');
    inputForDate.className = 'inp hidden';
    inputForDate.placeholder = 'Дата';
    containerTextDate.appendChild(textDiv);
    containerTextDate.appendChild(inputForText);
    containerTextDate.appendChild(dateDiv);
    containerTextDate.appendChild(inputForDate);

    //containerPriceButtons
    const containerPriceButtons = document.createElement('div');
    containerPriceButtons.className = 'container__price-buttons';
    //containerPrice
    const containerPrice = document.createElement('div');
    containerPrice.className = 'container__price';
    //priceDiv
    const priceDiv = document.createElement('div');
    priceDiv.innerHTML = `${item.price} `;
    containerPrice.appendChild(priceDiv);
    //inputForPrice
    let inputForPrice = document.createElement('input');
    inputForPrice.className = 'inp hidden';
    inputForPrice.placeholder = 'Цена';
    containerPrice.appendChild(inputForPrice);
    const divCurrency = document.createElement('div');
    divCurrency.innerHTML = ' р.';
    containerPrice.appendChild(divCurrency);
    //containerImg
    const containerButtons = document.createElement('div');
    containerButtons.className = 'container__buttons'
    //editImg
    const editImg = document.createElement('img');
    editImg.src = '/img/edit.svg';
    editImg.className = 'img';
    containerButtons.appendChild(editImg);
    //doneImg
    const doneImg = document.createElement('img');
    doneImg.src = '/img/check-mark.svg';
    doneImg.className = 'img hidden';
    containerButtons.appendChild(doneImg);
    //delImg
    const delImg = document.createElement('img');
    delImg.src = '/img/delete.svg';
    delImg.className = 'img';
    containerButtons.appendChild(delImg);

    containerPriceButtons.appendChild(containerPrice);
    containerPriceButtons.appendChild(containerButtons);

    //append in containerPurchase items
    containerPurchase.appendChild(containerTextDate);
    containerPurchase.appendChild(containerPriceButtons);

    containerTasks.appendChild(containerPurchase);

    //events ================================

    editImg.addEventListener('click', function () {
      editImg.classList.add('hidden');
      delImg.classList.add('hidden');
      doneImg.classList.remove('hidden');
      inputForText.classList.remove('hidden');
      inputForText.value = textDiv.innerHTML;
      textDiv.classList.add('hidden');

      inputForDate.classList.remove('hidden');
      inputForDate.value = dateDiv.innerHTML;
      dateDiv.classList.add('hidden');

      inputForPrice.classList.remove('hidden');
      inputForPrice.value = priceDiv.innerHTML;
      priceDiv.classList.add('hidden');
    })
    doneImg.addEventListener('click', async function () {
      doneImg.classList.add('hidden');
      inputForText.classList.add('hidden');
      textDiv.classList.remove('hidden');
      inputForDate.classList.add('hidden');
      dateDiv.classList.remove('hidden');
      inputForPrice.classList.add('hidden');
      priceDiv.classList.remove('hidden');
      editImg.classList.remove('hidden');
      delImg.classList.remove('hidden');
      const data = {
        _id: item['_id'],
        text: inputForText.value,
        date: inputForDate.value,
        price: inputForPrice.value,
      }
      await fetch('http://localhost:8000/updatePurchase',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        },
      );
      return render();
    })
    delImg.addEventListener('click', async () => {
      const resp = await fetch(`http://localhost:8000/deletePurchase/${item['_id']}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        },
      );
      const res = await resp;
      if (res) {
        return render();
      }
    });
    sumPurchases += item.price;
    countBeforeItem++;
  })
  amount.innerHTML = `${sumPurchases} р.`;

  // ================ arrShopping need map by list
  whereWasBuy.addEventListener('keyup', function(e) {
    valueInputWasBuy = e.target.value;
  });
  amountWasBuy.addEventListener('keyup', function(e) {
    valueInputAmountWasBuy = e.target.value;
  });
}


const addNewCost = () => {
  if (valueInputWasBuy && valueInputAmountWasBuy) {
    if (!+valueInputAmountWasBuy) {
      return alert('Value not a number');
    }
    const data = {
      text: valueInputWasBuy,
      date: newDate,
      price: valueInputAmountWasBuy
    };
    whereWasBuy.value = '';
    amountWasBuy.value = '';
    fetch('http://localhost:8000/createPurchase',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      },
    ).then(() => render());
  } else {
    return alert('Enter data');
  }
}