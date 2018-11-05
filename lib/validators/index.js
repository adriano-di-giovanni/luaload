const BooleanValidator = require('./BooleanValidator')
const ClientValidator = require('./ClientValidator')
const MappingsValidator = require('./MappingsValidator')
const SourceDirectoryValidator = require('./SourceDirectoryValidator')

exports.booleanValidator = new BooleanValidator()
exports.clientValidator = new ClientValidator()
exports.mappingsValidator = new MappingsValidator()
exports.sourceDirectoryValidator = new SourceDirectoryValidator()
