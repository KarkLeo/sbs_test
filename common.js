
document.addEventListener("DOMContentLoaded", function(event) {

  birthdayFormat()
  select(document)
  copyToClipboard()
  selectFilter()
  detectTimezone()
  sideBarActions()
  generatePasswordBtn()
  filterForm()
})



function birthdayFormat() {

  var userBirthday = document.getElementById('user_birthday')

  if (userBirthday) {

    dash_offset = userBirthday.placeholder.replace(/[^-.]/g, 9).split("-")[0].length - 2
    userBirthday.selectionStart = userBirthday.selectionEnd = userBirthday.value.length

    userBirthday.onmouseup = function (e) {
      this.selectionStart = this.selectionEnd = this.value.length
    }

    userBirthday.onkeyup = function (e) {

      input = userBirthday.value
      input = input.replace(/[\D\s\._]+/g, "")
      length = userBirthday.value.length

      if (length > 2 + dash_offset) {
        input = input.substr(0, 2 + dash_offset) + "-" + input.substr(2 + dash_offset)
      }

      if (length > 5 + dash_offset) {
        input = input.substr(0, 5 + dash_offset) + "-" + input.substr(5 + dash_offset)
      }

      if (length > 10) {
        input = input.substr(0, 10)
      }

      if (e.keyCode == 37 || e.keyCode == 36) {
        this.selectionStart = this.selectionEnd = this.value.length
      }

      userBirthday.value = input

    }

  }
}



function select(elem) {

  var selects = elem.querySelectorAll('.select')

  if (selects.length > 0) {

    selects.forEach(function(select) {

      select.addEventListener( "mouseleave" , function() {
        select.classList.remove("openList")
      })

      select.firstElementChild.addEventListener( "click" , function() {
        select.classList.toggle("openList")
      })

      var selectOptions = select.querySelectorAll('.select__selectOption')

      selectOptions.forEach(function(selectOption) {

        selectOption.addEventListener( "click" , function() {

          var selectList = this.parentNode

          var select = selectList.parentNode

          select.classList.remove("openList")

          select.firstElementChild.textContent = this.textContent
          select.firstElementChild.value = this.textContent

          hiddenField = selectList.firstElementChild
          hiddenField.value = this.getAttribute("data-" + hiddenField.name)

          disabledInputOnSelect = this.getAttribute("data-disabled-input-on-select")

          if (disabledInputOnSelect) {

            field = this.parentNode.parentNode.parentNode.parentNode
            input = field.querySelector('input[type="text"]')

            if (disabledInputOnSelect == "false") {
              input.disabled = false
            } else {
              input.disabled = true
              input.value = ""
              input.classList.remove("field_with_errors")
              field.querySelector(".errorText").textContent = ""
            }
          }

          commentRequiredData = this.getAttribute("data-comment-required")

          if (commentRequiredData) {
            
            popUpOpen()

            comment_form = document.getElementById("comment_form")
            commentRequiredField = document.getElementById("commentRequiredField")
            commentRequiredField.value = commentRequiredData
            user_id = this.getAttribute("data-user-id")
            comment_form.setAttribute("action", "/admin/users/" + user_id)
          }
        })

      })
    })
  }
}

function popUpOpen() {
  popUp = document.querySelector(".popUp")
  popUp.classList.add("popUp_active")

  popUpCloser = document.querySelector(".popUp_close")

  popUpCloser.addEventListener("click", function() {
    popUpClose()
  })
}

function popUpClose() {
  popUp = document.querySelector(".popUp")
  popUp.classList.remove("popUp_active")
}


function selectFilter() {

  var inputFilter = document.querySelector('.inputFilter')

  if (inputFilter) {

    var select = inputFilter.parentNode
    var selectList = select.querySelector('.select__selectList')
    var selectOptions = selectList.querySelectorAll('.select__selectOption')

    inputFilter.addEventListener( "click" , function(e) {
      inputFilter.value = ""
      selectOptions.forEach(function(selectOption) {
        selectOption.classList.add("visibleOption")
      })
    })

    inputFilter.addEventListener( "keyup" , function(e) {

      if (e.key != "Enter") {
        select.classList.add("openList")
      }

      var filter = e.target.value.toUpperCase()

      for (i = 0; i < selectOptions.length; i++) {

        if (selectOptions[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
          
          selectOptions[i].classList.add("visibleOption")
        } else {
          selectOptions[i].classList.remove("visibleOption")
        }
      }

      selectOptionsFilteredCount = selectList.querySelectorAll('.visibleOption').length

      if (selectOptionsFilteredCount == 1) {
        document.querySelector(".visibleOption").classList.add("selectOptionActive")
      } else if (document.querySelector(".selectOptionActive")) {
        document.querySelector(".selectOptionActive").classList.remove("selectOptionActive")
      }

    })

    inputFilter.addEventListener( "keydown" , function(e) {
      if (e.key === "Enter") {
        select.classList.remove("openList")
        e.preventDefault();

        if (document.querySelector(".selectOptionActive")) {
          inputFilter.value = document.querySelector(".selectOptionActive").textContent
        }
      }
    })
  }
}



function copyToClipboard() {

  var copyToClipboardBtn = document.querySelector('.copyToClipboardBtn')



  if (copyToClipboardBtn) {

    copyToClipboardBtn.addEventListener('click', function(event) {
      var copyTextField = copyToClipboardBtn.previousElementSibling.previousElementSibling

      copyTextField.focus()
      copyTextField.select()

      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'successful' : 'unsuccessful'
      } catch (err) {
        console.log('Oops, unable to copy')
      }

      window.getSelection().removeAllRanges()

    })
  }
}



function detectTimezone() {

  var timezoneInput = document.getElementById("user_timezone")

  if (timezoneInput && timezoneInput.value == "") {
    timezoneDetected = Intl.DateTimeFormat().resolvedOptions().timeZone

    tzList = timezoneInput.parentNode.querySelectorAll('.select__selectOption')

    tzFiltered = Array.from(tzList).filter(function(item) {
      return item.textContent == timezoneDetected
    })

    if (tzFiltered.length > 0) {
      timezoneInput.value = timezoneDetected
    }
  }
}



function sideBarActions() {

  var subMenuTogglers = document.querySelectorAll('.subMenuOpen')



  if (subMenuTogglers.length > 0) {



    subMenuTogglers.forEach(function(subMenuToggler) {

      var activeSubMenuItem = subMenuToggler.parentNode.querySelector('.active')

      if (activeSubMenuItem) {
        activeSubMenuItem.parentNode.parentNode.previousElementSibling.classList.add("open")
      }

      subMenuToggler.addEventListener("click", function(event) {
        this.classList.toggle("open")
      })
    })
  }
}



function generatePasswordBtn() {
  
  var generatePasswordBtn = document.querySelector('.generatePasswordBtn')

  if (generatePasswordBtn) {

    generatePasswordBtn.addEventListener('click', function(event) {
      var inputPassword = this.previousElementSibling
      inputPassword.value = generatePassword(12)
    })
  }
}

function generatePassword(length) {
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = ""
  
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  
  return retVal
}



function filterForm() {
  var filterForm = document.getElementById("filter_form")

  

  if (filterForm) {

    var textFilters = filterForm.querySelectorAll(".text_filter")
    var slectFilters = filterForm.querySelectorAll(".select_filter")
    var submitFilter = document.getElementById("submit_filter")

    textFilters.forEach(function(textFilter) {
      textFilter.addEventListener("keyup", function(e) {
        submitFilter.click()
      })
    })

    slectFilters.forEach(function(selectFilter) {
      selectFilter.addEventListener("click", function(e) {
        submitFilter.click()
      })
    })
  }
}
