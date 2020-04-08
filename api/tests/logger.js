const colors = require('colors');

colors.setTheme({
    object: ['magenta', 'bold'],
    string: ['yellow', 'bold'],
    number: ['brightMagenta', 'bold'],
    array: ['cyan', 'bold'],
    boolean: ['brightRed', 'bold'],
    success: ['brightGreen', 'bold'],
    error: ['brightRed', 'bold'],
    warning: ['brightYellow', 'bold']
});

const TAGS = {
    success: ' SUCCESS: ',
    error: ' ERROR: ',
    warning: ' WARNING: '
}

const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';

module.exports = {
    SUCCESS,
    ERROR,
    WARNING,

    logObject(obj) {
        let body = '   {\n';
        for(let key in obj){
            let type = Array.isArray(obj[key]) ? 'array' : typeof obj[key];
            body += `\t${key}: `;
    
            if(obj[key] === null || obj[key] === undefined) {
                body += colors.grey(`${obj[key]}\n`);
                continue;
            }
            
            switch(type) {
                case 'array':
                    body += colors[type](`[${type}] (${obj[key].length})\n`);
                    break;
                case 'object':
                    body += colors[type](`[${type}] { ${Object.keys(obj[key]).join(', ')} }\n`);
                    break;
                default:
                    if(obj[key].length > 50)
                        body += colors[type](`[${type}] (${obj[key].length})\n`);
                    else
                        body += colors[type](`${obj[key]}\n`);
                    break;
            }
        }
        body += '   }';
        console.log(body);
    },

    log(str, tag = SUCCESS) {
        console.log((TAGS[tag] + str)[tag]);
    }

}