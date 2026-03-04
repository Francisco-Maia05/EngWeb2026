const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.emdListPage = (list, d) => renderPug('index', { list, date: d });
exports.emdFormPage = (d) => renderPug('form', { date: d });
exports.emdFormEditPage = (e, d) => renderPug('form', { emd: e, date: d });
exports.emdDetailPage = (e, d) => renderPug('emdPage', { emd: e, date: d });
exports.emdStatsPage = (list, d) => renderPug('emdStats', { list, date: d });
exports.errorPage = (err, d) => renderPug('error', { message: err, date: d });