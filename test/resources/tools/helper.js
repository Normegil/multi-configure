var environmentVariablePrefix = 'CONFIG_MANAGER_TEST_';
module.exports.config = {
  test: {
    defaultValue: 'test.DefaultValue',
    environmentVariable: environmentVariablePrefix + 'TEST',
  },
  testNumber: {
    defaultValue: 0,
    environmentVariable: environmentVariablePrefix + 'TEST_NUMBER',
  },
  priorityTest: {
    defaultValue: 'WrongValue',
    environmentVariable: environmentVariablePrefix + 'PRIORITY_TEST',
  },
  object: {
    test1: {
      defaultValue: 'object.test1.DefaultValue1',
      environmentVariable: environmentVariablePrefix + 'OBJECT_TEST1',
    },
    test2: {
      defaultValue: 'object.test2.DefaultValue2',
      environmentVariable: environmentVariablePrefix + 'OBJECT_TEST2',
    },
  },
  array: {
    defaultValue: [1, 2, 3],
    environmentVariable: environmentVariablePrefix + 'ARRAY',
  },
};
