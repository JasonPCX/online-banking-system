/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    transform: {},
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    resetModules: true,
    setupFiles: ['dotenv/config'],
    detectOpenHandles: true,
};
