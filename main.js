$(() => {

  let coins = []

  $("section").hide()
  $("#homeSection").show()

  $("a").on("click", function () {
    const dataSection = $(this).attr("data-section")
    $("section").hide()
    $("#" + dataSection).show()
  })

  //getting Api
  function getAjax(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        data: {
        },
        beforeSend: function () { // Before  sending the request, remove the .hidden class from the spinner 
          $(".loader").removeClass('hidden')
        },
        success: function (data) {
          resolve(data)
        },
        complete: function () { // Set  complete callback, adding the .hidden class and hiding the spinner.
          $(".loader").addClass('hidden')
        },
        error: function (error) {
          reject(error)
        },
      })
    })
  }

  //getting coins

  async function handleCoins() {
    try {
      coins = await getAjax("https://api.coingecko.com/api/v3/coins/")
      console.log(coins)
      displayCoins(coins)
    }
    catch (err) {
      alert(err.message)
    }
  }
  handleCoins()

  //getting coins id

  async function getMoreInfo(coinId) {
    const coin = await getAjax("https://api.coingecko.com/api/v3/coins/" + coinId)
    return coin
  }

  //creating coins

  function createCard(coin) {
    const card = `
      <div class="card text-bg-light mb-3" >
      <div class="form-check form-switch">
      <input type="checkbox" class="form-check-input"  role="switch" id="${coin.id}-${coin.symbol}" >
      </div>
      <h6>${coin.id}</h6>
       <span id="symbol">${coin.symbol}</span><br>
       <img src="${coin.image.small}"/><br><br>
     
       <button class="btn-moreinfo" id="${coin.id}" >moreinfo</button>
       <div class="collapse"></div>
       </div>
       `
    return card
  }

  //displaying coins
  function displayCoins(coins) {
    let content = ""

    for (const coin of coins) {
      const card = createCard(coin)
      content += card
    }

    $("#homeSection").html(content)
    for (let i=0;i<chekedList.length;i++) {
      $(`#${chekedList[i]}`).prop("checked",true)
      }
  }

  //getting more information by clicking more info 
  $("#homeSection").on("click", ".card > button", async function () {
    const coinId = $(this).attr("id")
    $(this).next().toggle();                           //letting the information div to collapse by second clicking

    const spinner = `<div class="loader"></div>`         //loader
    $(this).next().html(spinner)
    const coin = await getMoreInfo(coinId)

    const content = `
  💲${coin.market_data.current_price.usd} <br>
  💶${coin.market_data.current_price.eur} <br>
  🪙${coin.market_data.current_price.ils}
  `
    //getting information from storage 
    let information = sessionStorage.getItem(coinId);
    //set which information the info div will get
    if (information) {
      $(this).next().html(information)
    }
    else {
      $(this).next().html(content)
    }
    //saving information in session storage 
    sessionStorage.setItem(coinId, content);
    setTimeout(function () {
      sessionStorage.removeItem(coinId)
    }
      , 1000 * 120);
  })

  //search line
  $("input[type=search]").on("keyup", function () {
    const textToSearch = $(this).val().toLowerCase()
    if (textToSearch === "")
      displayCoins(coins)
    else {
      const filteredCoins = coins?.filter(coin => coin.symbol.indexOf(textToSearch) >= 0)
      displayCoins(filteredCoins)
    }
  })

  //pushing the checked coinss into array of checked coins
  let chekedList = []

  function createLimitedArray() {
    $("#homeSection").on("change", ".card>.form-check >input", function () {
      let card = $(this).attr("id")

      if ($(this).is(":checked"))                                            //pushing the true buttons into array
        chekedList.push(card)
      console.log(chekedList)


      if ($(this).is(":checked") === false) {                               //deleting false buttons from array             
        chekedList = jQuery.grep(chekedList, function (value) {
          return value != card
        })
        console.log(chekedList)
      }

      if (chekedList.length > 5) {                                         //showing modal by the 6th clicking

        $(this).prop("checked", false)                                       //turn off the button if there are 5 chosen coins
        last = $(this).attr("id")
        if ($(this).is(":checked") === false) {                              //remove the 6th card from array
          chekedList = jQuery.grep(chekedList, function (value) {
            return value != card
          })
          console.log(chekedList)
        }
        modal(last)
      }
    })
  }
  createLimitedArray()


 function modal(last) {

    let modal = `<div class="modal" tabindex="-1">
  <div class="modal-dialog">
  <div class="modal-content">
  <div class="modal-header">
  <h5 class="modal-title">Sorry,you can choose only five cards</h5>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div><br>
  <h6 >The chosen items are:</h6>
  
  <div class="modal-body">
  <div class="form-check form-switch" >
            <input class="form-check-input" type="checkbox" name="${chekedList[0]}" role="switch" id="0" checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">${chekedList[0]} </label>
          </div>

          <div class="form-check form-switch" >
            <input class="form-check-input" type="checkbox" name="${chekedList[1]}" role="switch" id="1" checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">${chekedList[1]}</label>
          </div>

  <div class="form-check form-switch" >
            <input class="form-check-input" type="checkbox" name="${chekedList[2]}" role="switch" id="2" checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">${chekedList[2]}</label>
          </div>

          <div class="form-check form-switch" >
            <input class="form-check-input" type="checkbox" name="${chekedList[3]}" role="switch" id="3"  checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">${chekedList[3]}</label>
          </div>

          <div class="form-check form-switch" >
            <input class="form-check-input" type="checkbox" name="${chekedList[4]}" role="switch" id="4" checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">${chekedList[4]}</label>
          </div>
  
  </div>
  <div class="modal-footer">
  <button type="button" class="btn btn-primary" id="save">Save changes</button>
  </div>
  </div>
  </div>
  </div>`

    $(".card").last().append(modal)
    $(".modal").show()
    $(".modal").on("click", ".btn-close", function () {
      $(".modal").hide()
    })
    save(last)
  }
 function turnOnTheLastButton(last) {

    if (chekedList.length < 5) {
      $(`#${last}`).prop("checked", true)
      chekedList.push(last)
      console.log("new list  " + chekedList)
    }

    console.log("empty " + last)
  }

  //letting the user to change his choices
 function save(last) {
    $(".modal").on("click", "#save", function () {

      let name = ""
      for (let i = 0; i < 5; i++) {
        if ($(`#${i}`).is(":checked") === false) {
          name = $(`#${i}`).attr("name")

          chekedList = jQuery.grep(chekedList, function (value) {
            return value != name
          })
          $(`#${name}`).prop("checked", false)

        }
      }
      $(".modal").remove()
      turnOnTheLastButton(last)
    })
    console.log("after modal   :" + chekedList)

  }

  //about page
 let about = `
 <div class="row">
   <div class="column">
     <div class="cardabout">
       <div class="container">
       <h2>So What Is Digital Currency All About? </h2>
       <p class="title">Reporting Digital Currency </p>
       <p>Our site provides a real time reporting on the 50 top cuerrency out there!</p>
       <p>You can get their value in USD dollar ,Euro and ILS in real time!</p>
       <p>Here is an option for watching graphs which displaying flow of changes in real time! </p>
       </div>
     </div>
   </div>
 
   <div class="column">
     <div class="cardabout"><br>
       <img src="me.jpg"  alt="image" class="rounded"> 
       <div class="container">
       <h2>Faigy Shapiro</h2>
       <p class="title">A qualified and proffesional web developer</p>
       <p>with a lot of experience in banking and  financial data, </p>
       <p> I provide  services for banks and financial companies! </p>
       <p><button class="buttonabout" id="contact">Contact</button></p>
       </div>
     </div>
   </div> `

  $("#aboutSection").html(about)

})
