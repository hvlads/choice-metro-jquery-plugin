## Usage
````javascript
   $('#metro_moscow').metro({
          'placeholder': 'Выберите метро',
          'city': "1", // 1-Москва, 2-Спб и т.д см. https://api.hh.ru/metro
          'callback': (selected_metro) => {
              console.log(selected_metro)
           }
    });
 ````
