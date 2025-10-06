const sub = document.querySelector('.sub')
const form = document.querySelector('form')
const email = document.querySelector('.email')
const country = document.querySelector('.country')
const zip = document.querySelector('.zip')
const pass = document.querySelector('.pass')
const confPass = document.querySelector('.conf-pass')

const emailRegExp = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)*$/i;
const zipReg = /^\d{5}(-\d{4})?$/

// add novalidate to the form to handle all validation in JS
if (form) form.setAttribute('novalidate', 'true')

// helper: get or create an inline error element after an input
const getErrorEl = (input) => {
	// prefer nextElementSibling with class 'error'
	if (!input) return null
	let el = input.nextElementSibling
	if (el && el.classList && el.classList.contains('error')) return el
	// create one
	el = document.createElement('span')
	el.className = 'error'
	el.setAttribute('aria-live', 'polite')
	input.insertAdjacentElement('afterend', el)
	return el
}

// validators with messages
const validators = {
	email: (val) => {
		if (!val) return { ok: false, msg: 'Email is required.' }
		if (!emailRegExp.test(val)) return { ok: false, msg: 'Enter a valid email (e.g. user@example.com).' }
		return { ok: true }
	},
	country: (val) => {
		if (!val || !val.trim()) return { ok: false, msg: 'Country is required.' }
		return { ok: true }
	},
	zip: (val) => {
		if (!val) return { ok: false, msg: 'Postal code is required.' }
		if (!zipReg.test(val)) return { ok: false, msg: 'Enter a valid ZIP (12345 or 12345-6789).' }
		return { ok: true }
	},
	pass: (val) => {
		if (!val) return { ok: false, msg: 'Password is required.' }
		if (val.length < 8) return { ok: false, msg: 'Password must be at least 8 characters.' }
		return { ok: true }
	},
	confPass: (val) => {
		if (!val) return { ok: false, msg: 'Please confirm your password.' }
		if (pass && val !== pass.value) return { ok: false, msg: 'Passwords do not match.' }
		return { ok: true }
	}
}

// helper to set classes and messages
const setState = (input, result) => {
	const err = getErrorEl(input)
	if (result.ok) {
		input.classList.remove('invalid')
		input.classList.add('valid')
		if (err) {
			err.textContent = ''
			err.removeAttribute('aria-hidden')
		}
	} else {
		input.classList.remove('valid')
		input.classList.add('invalid')
		if (err) err.textContent = result.msg
	}
}

// field-specific handlers
const validateEmail = () => {
	if (!email) return true
	const res = validators.email(email.value.trim())
	setState(email, res)
	return res.ok
}
const validateCountry = () => {
	if (!country) return true
	const res = validators.country(country.value.trim())
	setState(country, res)
	return res.ok
}
const validateZip = () => {
	if (!zip) return true
	const res = validators.zip(zip.value.trim())
	setState(zip, res)
	return res.ok
}
const validatePass = () => {
	if (!pass) return true
	const res = validators.pass(pass.value)
	setState(pass, res)
	// re-validate confirm when password changes
	if (confPass) validateConfPass()
	return res.ok
}
const validateConfPass = () => {
	if (!confPass) return true
	const res = validators.confPass(confPass.value)
	setState(confPass, res)
	return res.ok
}

// attach live input listeners
if (email) email.addEventListener('input', validateEmail)
if (country) country.addEventListener('input', validateCountry)
if (zip) zip.addEventListener('input', validateZip)
if (pass) pass.addEventListener('input', validatePass)
if (confPass) confPass.addEventListener('input', validateConfPass)

// on submit validate everything; if all valid, give a high five
const handleSubmit = (event) => {
	event.preventDefault()
	const checks = [
		validateEmail(),
		validateCountry(),
		validateZip(),
		validatePass(),
		validateConfPass()
	]
	const allValid = checks.every(Boolean)
	if (!allValid) {
		// focus first invalid
		const firstInvalid = form.querySelector('.invalid')
		if (firstInvalid) firstInvalid.focus()
		return
	}
	// high five (non-destructive success feedback)
	alert('High five! Form submitted.')
	// optional: reset form and states
	form.reset()
	;[email, country, zip, pass, confPass].forEach((i) => {
		if (!i) return
		i.classList.remove('valid')
		i.classList.remove('invalid')
		const e = getErrorEl(i)
		if (e) e.textContent = ''
	})
}

if (form) form.addEventListener('submit', handleSubmit)

// initial validation pass to set initial classes (if fields prefilled)
validateEmail()
validateCountry()
validateZip()
validatePass()
validateConfPass()