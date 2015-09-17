#!/bin/bash
CONFIG_MANAGER_TEST_TEST=test.EnvVar \
CONFIG_MANAGER_TEST_TEST_NUMBER=testNumber.EnvVar \
CONFIG_MANAGER_TEST_OBJECT_TEST1=object.test1.EnvVar \
CONFIG_MANAGER_TEST_OBJECT_TEST2=object.test2.EnvVar \
CONFIG_MANAGER_TEST_ARRAY='[1, 2, 3]' \
  node_modules/mocha/bin/mocha \
    test/**/*.js \
    test/*.js
