const checkPass = (req, res, next) => {
  const { password } = req.body;
  const adminPassword = process.env.PASSWORD;
  if (password === adminPassword) {
    next();
    res.render("index.ejs", { success: true });
  } else {
    res.render("index.ejs", { success: false });
    return;
  }
};

module.exports = checkPass;
