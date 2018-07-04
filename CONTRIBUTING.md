## Contributing

**Feature Branch:** Allows you to make updates locally without affecting the master branch.
- Create a feature branch off of the master branch
- Make all local changes to that feature branch
- Push local changes to GitHub often
- Make pull request against develop branch in GitHub
- Assign pull request to other contributors

**Develop Branch:** Allows you to test updates from multiple feature branches before merging them into master.
- Feature branches are merged into develop by pull request
- Updates are tested on develop branch to validate previous functionality has not been broken and implemented functionality works as expected
- Pull request is made against master branch when tests are validated as passing.

**Master Branch:** The most up to date working version of the app.  
- Develop branch is merged into master at regular interval. 
- Release Tag is created on develop branch in GitHub before develop branch is merged into master.
- When master branch is updated all feature branches need to be updated.

**Updating feature branch with master**
- ```git checkout {feature branch name}```
- ```git pull --all``` 
- ```git rebase master```

### Troubleshooting
**Merge Conflicts:**

- If not sure how to deal with a merge conflict abort and ask a fellow contributor for help.
