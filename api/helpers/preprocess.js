const getIP = require('ipware')().get_ip;
const colors = require('colors');

colors.setTheme({
    object: ['magenta', 'bold'],
    string: ['yellow', 'bold'],
    number: ['brightMagenta', 'bold'],
    array: ['cyan', 'bold'],
    boolean: ['brightRed', 'bold']
});

// Print requests to console
module.exports = 
    (req, _, next) => {
        console.log('-----------------------------------------------------------------------------');
        console.log(`| SOURCE: ${getIP(req).clientIp}`);
        console.log(`| DESTINATION: ${req.method} - ${req.path}`);
        console.log('-----------------------------------------------------------------------------');

        let body = '';
        if(Object.entries(req.body).length === 0)
            body = 'Empty';
        else {
            body += '{\n';
            for(let key in req.body){
                let type = Array.isArray(req.body[key]) ? 'array' : typeof req.body[key];
                body += `|\t${key}: `;

                if(req.body[key] === null || req.body[key] === undefined) {
                    body += colors.grey(`${req.body[key]}\n`);
                    continue;
                }
                
                switch(type) {
                    case 'array':
                        body += colors[type](`[${type}] (${req.body[key].length})\n`);
                        break;
                    case 'object':
                        body += colors[type](`[${type}] { ${Object.keys(req.body[key]).join(', ')} }\n`);
                        break;
                    default:
                        if(req.body[key].length > 50)
                            body += colors[type](`[${type}] (${req.body[key].length})\n`);
                        else
                            body += colors[type](`${req.body[key]}\n`);
                        break;
                }
            }
            body += '| }';
        }

        console.log(`| ${body}`);
        console.log('-----------------------------------------------------------------------------');
        console.log('\n');

        next();
    }