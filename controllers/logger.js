var bunyan = require('bunyan');
function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers
    };
}
var log = bunyan.createLogger({
    name: 'CUT The Fund',
    serializers: bunyan.stdSerializers,
    streams: [{
        path: './cut_log.log',
    }]
    // serializers: {
    //     req: reqSerializer
    // }
});

module.exports = log;