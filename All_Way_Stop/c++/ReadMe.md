# Traffic Algorithm

An algorithm to efficiently manage car interactions at an intersection.
**WORK IN PROGRESS**

## Table of Contents

- [Usage](#usage)
- [Future](#future)
- [Contributing](#contributing)
- [License](#license)


## Usage
To run this locally simply enter this in the terminal:

First this program requires a json reader so follow these instructions so download the zip folder from https://github.com/open-source-parsers/jsoncpp


``` bash
$ g++ -o intersection intersection.cpp <path to json_reader.cpp>  <path to json_value.cpp> <path to json_writer.cpp>-std=c++11 -I<path to include directory>

```

## Context
An algorithm to process car data and systematically decide at a four-way-stop intersection which car may enter the intersection.
Takes in the cars that haave already been spawned and determines the order in which they cross the intersection.
## Future
- [ ] Add communication with webserver (locally through websockets)
- [ ] Append the json with the right of way order
- [ ] Account for a variety of speeds.
- [ ]


## Contributing
Anyone is welcome to contribute to this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
