document.addEventListener('DOMContentLoaded', function () {
    const car_1 = document.getElementById('car_1');
    const car_2 = document.getElementById('car_2');

    car_1.addEventListener('click', function () {
        car_1.classList.toggle('animate');
    });
    car_2.addEventListener('click', function () {
        car_2.classList.toggle('animate');
    });
});
