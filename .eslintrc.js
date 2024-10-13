module.exports = {
    "plugins": [
        "prettier",
    ],
    //force consistent casing in files names
    "filenames/match-regex": [2, "^[a-z-.]+$", true],
    //force consistent naming when requiring a path
    "import/no-dynamic-require": 0,
    //force consistent naming when importing a path
    "import/no-unresolved": 0,
    //force consistent naming when exporting a path
    "import/named": 0,
}