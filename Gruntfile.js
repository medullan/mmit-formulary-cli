module.exports = function(grunt){

    grunt.initConfig({
        conventionalChangelog: {
            options: {
                changelogOpts: {
                    // conventional-changelog options go here
                    preset: 'angular'
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'CHANGELOG.md'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false
            }
        }
    });
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['bump-only:patch', 'conventionalChangelog', 'bump-commit']);
    grunt.registerTask('release:minor', ['bump-only:minor', 'conventionalChangelog', 'bump-commit']);
    grunt.registerTask('release:major', ['bump-only:major', 'conventionalChangelog', 'bump-commit']);
};