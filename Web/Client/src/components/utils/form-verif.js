const formRegex = {
  pseudo: /^[a-z]{3,10}$/i,
  birth: /^(\d{4})-(\d{2})-(\d{2})$/,
  phone: /^\d{10}$/,
  email: /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i,
  price: /^\d{1,7}$/,
}

const inputStyle = {
  valid: 'border-color: #666;',
  invalid: 'border-color: red;',
}

const showError = {
  input: {
    none: null,
    sex: "Veuillez choisir un seul et unique sexe",
    pseudo: "Doit être compris entre 4 et 10 caractères",
    email: "L'adresse email n'est pas valide",
    phone: "Le numero de téléphone n'est pas valide",
    birth: "La date de naissance n'est pas valide",
    password: "Doit contenir au moins 6 caractères",
    confirm: "Doit être identique au mot de passe",
    login: "Entrer un email ou un numéro de téléphone valide",
    title: "Le titre doit contenir au moins 4 caractères",
    description: "La description doit contenir au moins 25 caractères",
    video: "Veuillez insérer une vidéo",
    price: "Veuillez insérer un prix supérieur ou égal à 0 Ar",
    category: "Séléctionnez une catégorie dans la liste",
    time: "Séléctionnez l'heure du début",
    image: "Veuillez insérer une image",
    duration: "Séléctionnez une durée dans la liste",
    playlist: "Séléctionnez une playlist dans la liste",
  },
  db: {
    none: null,
    phone: "Le numero de téléphone est déjà utiliser",
    email: "L'adresse email est déjà utiliser",
    login: "L'identifiant ou le mot de passe est incorrect",
  },
  style: {
    color: 'red',
  },
}

const capitalize = (string) => {
  string = string.toLowerCase()
  string = string.replace(string.charAt(0), string.charAt(0).toUpperCase())

  return string
}

const isObjEmpty = (obj) => {
  for (const elt in obj)
    return false

  return true
}

const inputCheck = {
  sex: (sex) => {
    if(!sex[0].checked && !sex[1].checked)
      return false

    return true
  },
  birth: (birth) => {
    if(formRegex.birth.test(birth.value)) {
      // Il faut verifier ici l'âge de l'utilisateur
      return true
    }
    
    birth.style = inputStyle.invalid
    return false
  },
  pseudo: (pseudo) => {
    pseudo.value = capitalize(pseudo.value)

    if(!formRegex.pseudo.test(pseudo.value)) {
      pseudo.style = inputStyle.invalid
      return false
    }

    pseudo.style = inputStyle.valid
    return true
  },
  email: (email) => {
    email.value = email.value.toLowerCase()

    if(!formRegex.email.test(email.value)) {
      email.style = inputStyle.invalid
      return false
    }

    email.style = inputStyle.valid
    return true
  },
  phone: (phone) => {
    if(!formRegex.phone.test(phone.value)) {
      phone.style = inputStyle.invalid
      return false
    }

    phone.style = inputStyle.valid
    return true
  },
  password: (password) => {
    if(password.value.length < 6) {
      password.style = inputStyle.invalid
      return false
    }
  
    password.style = inputStyle.valid
    return true
  },
  confirm: ({ confirm, password }) => {
    if(confirm.value.length < 6 || confirm.value !== password.value) {
      confirm.style = inputStyle.invalid
      return false
    }

    confirm.style = inputStyle.valid
    return true
  },
  login: (login) => {
    login.value = login.value.toLowerCase()

    if(formRegex.email.test(login.value)) {
      login.style = inputStyle.valid
      return true
    }
    else if(formRegex.phone.test(login.value)) {
      login.style = inputStyle.valid
      return true
    }

    login.style = inputStyle.invalid
    return false
  },
  title: (title) => {
    if(title.value.length < 4) {
      return false
    }

    return true
  },
  description: (description) => {
    if(description.value.length < 25) {
      return false
    }

    return true
  },
  video: (video) => {
    if(video.files.length === 0) {
      return false
    }

    return true
  },
  image: (image) => {
    if(image.files.length === 0) {
      return false
    }

    return true
  },
  price: (price) => {
    if(!formRegex.price.test(price.value)) {
      return false
    }

    return true
  },
  date: (date) => {
    if(date.value === '') {
      return false
    }

    return true
  },
  time: (time) => {
    if(time.value === '') {
      return false
    }

    return true
  },
}

export { formRegex, inputCheck, showError, isObjEmpty }
