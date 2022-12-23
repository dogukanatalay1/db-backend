const sequelize = require('../scripts/helpers/sequelize.helper');

const getAll = async (model) => await sequelize.query(`SELET * FROM ${model}`);

const getAllByQuery = async (model, key, query) => await sequelize.query();

const getOneById = async (model, id) => await sequelize.query();

const getOneByQuery = async (model, key, query) => await sequelize.query();

const create = async (model, data) => await sequelize.query();

const updateById = async (model, id, data) => '';

const updateByQuery = async (model, query, data) => '';

const deleteById = async (model, id) => '';

const deleteByQuery = async (model, query) => '';

module.exports = {
    getAll,
    getOneById,
    getOneByQuery,
    getAllByQuery,
    create,
    updateById,
    updateByQuery,
    deleteById,
    deleteByQuery,
};
