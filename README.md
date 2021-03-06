# El-gorithm 
>   A Javascript Library for Data Manipulation.
    This library is exported as a UMD module.

[NPM](https://www.npmjs.com/package/el-gorithm) | [Demo](https://npm.runkit.com/el-gorithm) | [Github](https://github.com/koficodedat/el-gorithm)

#### Quick Setup and Usage
    npm i -g el-gorithm (globally)
    npm i --save el-gorithm (local project)
    
    var el = require('el-gorithm');
    
    ...
    
    var sortedList = el.mergeSort([3,5,2,6,4]); // [2,3,4,5,6]
    
#### Version
>    1.0.29

#### New in Version 1.0.29
_Fixes_
- Fixed issue with _arrayMax( ... )_ utility function.
- Fixed  _compare( ... )_ function documentation.
- Updated functionality and documentation of _accumulate( ... )_ to add runningMean.
  
#### Testing
    Run either 'npm test' or 'gulp' on command line after compiling .ts files to .js files.

#### API
- _API Walkthrough on Github_
    - [Utility](./doc/utility.md)
    - [Sort](./doc/sort.md)
    - [Data Structure](./doc/data-structure.md)

- _API Walkthrough on Runkit_
   - [Utility](https://npm.runkit.com/el-gorithm/doc/utility.md)
   - [Sort](https://npm.runkit.com/el-gorithm/doc/sort.md)
   - [Data Structure](https://npm.runkit.com/el-gorithm/doc/data-structure.md)
    
#### Contribution
>   Any one that wants to help with anything 
    from testing, expanding the scope of features to documentation 
    should seek a request via the [issue](https://github.com/koficodedat/el-gorithm/issues) feature on Github.
    
#### Issues
>   Please report issues as you see them during usage. It will help improve this library as a whole.
    Thank you.
    
#### Credits
>   Algorithms 4th Edition by Robert Sedgewick and Kevin Wayne.
