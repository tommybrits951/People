



function capitalizeFirstLetter(string) {
    let str = string.split("")
    str[0] = str[0].toUpperCase()
    return str.join("").trim()
}

function checkNames(name) {
    const str = name.split("")
    const reg = new RegExp(/[a-z]/gi)
    for (let i = 0; i < str.length; i++) {
        if (!str[i].match(reg)) {
            return false
        }
    }
    return true
}

function checkDOB(dob) {
    const date = new Date(dob)
    const now = new Date()
    if (date >= now) {
        return false
    }
    return true
}
async function checkFields(req, res, next) {
    let {email, first_name, last_name, dob, postal, password, gender} = req.body;
    console.log(first_name, last_name)
    
    if (gender !== "Male" && gender !== "Female" && gender !== "Private") {
        return res.status(400).json({message: "Invalid gender."});
    }
    postal = postal.split("")
    if (postal.length !== 5 || postal.some(char => isNaN(Number(char)))) {
        return res.status(400).json({message: "Invalid postal code."});
    }
    if (!email || !first_name || !last_name || !dob || !postal || !password || !gender) {
        return res.status(400).json({message: "Missing required fields."});
    }
    if (!checkNames(first_name) || !checkNames(last_name)) {
        return res.status(400).json({message: "Names can only contain letters."});
    }
    if (!checkDOB(dob)) {
        return res.status(400).json({message: "Invalid date of birth."});
    }

 first_name = capitalizeFirstLetter(first_name);
 last_name = capitalizeFirstLetter(last_name);
 req.body.first_name = first_name;
 req.body.last_name = last_name;
    return next();

}


module.exports = {
    checkFields
};