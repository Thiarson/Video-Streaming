import type { DynamicObject } from "./types/object"

type InputCheck = {
  [key: string]: (value: HTMLInputElement) => boolean
}

type StyleType = keyof typeof styles

const formRegex = {
  pseudo: /^[a-z]{3,10}$/i,
  birth: /^(\d{4})-(\d{2})-(\d{2})$/,
  phone: /^\d{10}$/,
  email: /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i,
  price: /^\d{1,7}$/,
}

const styles: DynamicObject<string, Partial<CSSStyleDeclaration>> = {
  valid: {
    borderColor: "#666",
  },
  invalid: {
    borderColor: "red"
  },
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

const isFieldNull = (fields: DynamicObject<string, HTMLElement | null>) => {
  let inputs: DynamicObject<string, HTMLElement> = {}

  for (const [key, value] of Object.entries(fields)) {
    if (value === null)
      throw new Error(`${key} reference is null`)

    inputs[key] = value
  }

  return inputs
}

const isBoxNull = (input: (HTMLInputElement | null)[]) => {
  let inputs: HTMLInputElement[] = []

  input.forEach((box) => {
    if (box === null)
      throw new Error(`${box} reference is null`)

    inputs.push(box)
  })

  return inputs
}

const changeStyle = (element: HTMLElement, type: StyleType) => {
  for (const [key, value] of Object.entries(styles[type])) {
    (element.style as any)[key] = value
  }
}

const capitalize = (string: string) => {
  string = string.toLowerCase()
  string = string.replace(string.charAt(0), string.charAt(0).toUpperCase())

  return string
}

const isObjEmpty = (obj: Object) => {
  for (const elt in obj)
    return false

  return true
}

const sexCheck = (sex: HTMLInputElement[]) => {
  if (!sex[0].checked && !sex[1].checked)
    return false

  return true
}


const confirmCheck = ({ confirm, password }: DynamicObject<string, HTMLInputElement>) => {
  if(confirm.value.length < 6 || confirm.value !== password.value) {
    changeStyle(confirm, "invalid")
    return false
  }

  changeStyle(confirm, "valid")
  return true
}

const inputCheck: InputCheck = {
  birth: (birth) => {
    if(formRegex.birth.test(birth.value)) {
      // Il faut verifier ici l'âge de l'utilisateur
      return true
    }
    
    changeStyle(birth, "invalid")
    return false
  },
  pseudo: (pseudo) => {
    pseudo.value = capitalize(pseudo.value)

    if(!formRegex.pseudo.test(pseudo.value)) {
      changeStyle(pseudo, "invalid")
      return false
    }

    changeStyle(pseudo, "valid")
    return true
  },
  email: (email) => {
    email.value = email.value.toLowerCase()

    if(!formRegex.email.test(email.value)) {
      changeStyle(email, "invalid")
      return false
    }

    changeStyle(email, "valid")
    return true
  },
  phone: (phone) => {
    if(!formRegex.phone.test(phone.value)) {
      changeStyle(phone, "invalid")
      return false
    }

    changeStyle(phone, "valid")
    return true
  },
  password: (password) => {
    if(password.value.length < 6) {
      changeStyle(password, "invalid")
      return false
    }
  
    changeStyle(password, "valid")
    return true
  },
  login: (login) => {
    login.value = login.value.toLowerCase()

    if(formRegex.email.test(login.value)) {
      changeStyle(login, "valid")
      return true
    }
    else if(formRegex.phone.test(login.value)) {
      changeStyle(login, "valid")
      return true
    }

    changeStyle(login, "invalid")
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
    const { files } = video

    if(files === null || files.length === 0) {
      return false
    }

    return true
  },
  image: (image) => {
    const { files } = image

    if(files === null || files.length === 0) {
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

export { formRegex, inputCheck, sexCheck, confirmCheck, showError, isFieldNull, isBoxNull, changeStyle, isObjEmpty }
