#include <iostream>  // For standard input/output operations
#include <fstream>   // For file input/output operations
#include <json/json.h>  // For handling JSON data
#include <vector>    // For using vectors to store Car instances
#include <queue>     // For using queues to store Car instances
#include <chrono>    // For working with time (arrival time)
#include <algorithm> // For using std::sort to sort Car instances

struct Car 
{
    std::string car_id; // Unique id
    std::string entrance; // [north,south,east,west]
    std::string exit; // [north,south,east,west]
    int speed; // Pixels per second
    int arrival_time; // Milliseconds
    
    // Checks if the car is null
    bool isNull() const 
    {
        return (car_id.empty() && entrance.empty() && exit.empty() && speed == 0 && arrival_time == 0);
    }

    // Defines the == operator to compare car instances
    bool operator==(const Car& other) const 
    {
        return (car_id == other.car_id &&
                entrance == other.entrance &&
                exit == other.exit &&
                speed == other.speed &&
                arrival_time == other.arrival_time);
    }

};

// Processes the JSON data
bool readJSONFile(const std::string& filename, Json::Value& root) 
{
    std::ifstream file(filename);
    if (!file.is_open()) 
    {
        std::cerr << "Failed to open JSON file: " << filename << std::endl;
        return false;
    }

    Json::CharReaderBuilder builder;
    Json::CharReader* reader = builder.newCharReader();
    std::string errs;

    if (!Json::parseFromStream(builder, file, &root, &errs)) 
    {
        std::cerr << "Error parsing JSON: " << errs << std::endl;
        delete reader;
        return false;
    }

    file.close();
    delete reader;

    return true;
}

// Process directional queues all in one go (good for straightaways)
void processQueue(const std::string& direction, std::queue<Car>& carQueue) 
{
    std::cout << "Processing cars from " << direction << " direction:\n";
    
    while (!carQueue.empty()) {
        Car current_car = carQueue.front();
        carQueue.pop();

        std::cout << "Car ID: " << current_car.car_id << "\n";
        std::cout << "Entrance: " << current_car.entrance << "\n";
        std::cout << "Exit: " << current_car.exit << "\n";
        std::cout << "Speed: " << current_car.speed << "\n";
        std::cout << "Arrival Time: " << current_car.arrival_time << "\n\n";
    }
}

// Updates direction queues
void updateQueue(std::queue<Car>& carQueue, Car& currentCar) 
{
    if (carQueue.empty()) 
    {
        currentCar = {"", "", "", 0, 0}; // Sets the current car to a'null' car
    } 
    /*
    else if (car.speed * (current_time-car.arrival_time) == 40% of the vertical width)
    {
        currentCar = {"", "", "", 0, 0}; // Sets the current car to a "null" car since car hasnt arrived at the intersection
    }
    */
    
    else 
    {  
        currentCar = carQueue.front();
        carQueue.pop();
    
    }
}

void insertionSort(std::vector<Car>& directionList) 
{
    for (int i = 1; i < directionList.size(); ++i) 
    {
        Car key = directionList[i];

        // Skips the "null" cars
        if (key.isNull()) 
            continue;

        int j = i - 1;

        // Move elements of directionList[0..i-1] that have higher arrival_time
        // than the current key.arrival_time to one position ahead of their current position
        while (j >= 0 && (directionList[j].isNull() || directionList[j].arrival_time > key.arrival_time)) 
        {
            directionList[j + 1] = directionList[j];
            --j;
        }

        directionList[j + 1] = key;
    }
}

// Sorting function using the order from the first iteration
bool sortByFirstIterationOrder(const Car& a, const Car& b, const std::vector<std::string>& firstIterationOrder)
{
    auto x = std::find(firstIterationOrder.begin(), firstIterationOrder.end(), a.entrance);
    auto y = std::find(firstIterationOrder.begin(), firstIterationOrder.end(), b.entrance);

    return std::distance(firstIterationOrder.begin(), x) < std::distance(firstIterationOrder.begin(), y);
}

int main() {
    Json::Value root;

    std::vector<Car> cars;
    std::vector<std::string> initial_directions = {"north", "east", "south", "west"};
    std::queue<Car> north_queue, south_queue, east_queue, west_queue;
    std::vector<Car> directionList(4); // Stores the current intersection order
    std::vector<std::string> iterationOrder;  // Vector to store the entrance order of the first iteration
    const Car NullCar = {"", "", "", 0, 0};  // Represents a null or empty car
    bool isFirstIteration = true;       
    if (readJSONFile("cars.json", root)) 
    {
        for (const auto& car : root) 
        {
            Car current_car;
            
            current_car.car_id = car["car_id"].asString();
            current_car.entrance = car["entrance"].asString();
            current_car.exit = car["exit"].asString();
            current_car.speed = car["speed"].asInt();
            current_car.arrival_time = car["arrival_time"].asInt();  // Milliseconds

            if (current_car.entrance == "north")
                north_queue.push(current_car);
            else if (current_car.entrance == "south")
                south_queue.push(current_car);
            else if (current_car.entrance == "east")
                east_queue.push(current_car);
            else if (current_car.entrance == "west")
                west_queue.push(current_car);
        }
        
        // Logic for which direction to choose from
        while (!north_queue.empty() || !south_queue.empty() || !east_queue.empty() || !west_queue.empty())
        {
            updateQueue(north_queue, directionList[0]);
            updateQueue(south_queue, directionList[1]);
            updateQueue(east_queue, directionList[2]);
            updateQueue(west_queue, directionList[3]);
 
            if (isFirstIteration)
            {
                insertionSort(directionList);
                isFirstIteration = false;  // Sets the flag to false after the first iteration
                
                // Stores the order of entrances from the first iteration
                for (const auto& car : directionList)
                {
                    iterationOrder.push_back(car.entrance);
                }
            }
            else
            {
                // Sort based on the order from the first iteration
                std::stable_sort(directionList.begin(), directionList.end(),
                    [&iterationOrder](const Car& a, const Car& b) {
                        return sortByFirstIterationOrder(a, b, iterationOrder);
                    });
            }

            // Prints the sorted list
            for (const auto& car : directionList) 
            {
                if (!car.isNull())
                    std::cout << "Car ID: " << car.car_id << ", Arrival Time: " << car.arrival_time << ", Direction: " << car.entrance<< "\n";
                // Add the websocket functionality here
            }
        
        }
        /*
        // Process cars from each queue
        processQueue("North", north_queue);
        processQueue("South", south_queue);
        processQueue("East", east_queue);
        processQueue("West", west_queue);
        */
    }

    return 0;
}
