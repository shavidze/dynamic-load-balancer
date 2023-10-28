## Instructions:


#### Start consul 🖥️
გავუშვათ `კონსულის აგენტი` დეველოპმენტ მოუდში:

```bash
npm run start:consul
```

#### Start:apps 🚀

გავუშვათ და დავარეგისტრიროთ 2 ინსტანსი `api-service`-ის და 1 ინსტანსი `webapp-service`-ის:

```bash
npm run start:apps
```


#### Start:loadBalancer

დავსტარტოთ ლოად-ბალანსერი, ტრეფიკის საკონტროლებლად:

```bash
npm run start:loadBalancer
```

#### გავუშვათ რექვესტი `api`-ზე 2ჯერ, დავინახავთ რომ სხვადასხვა ინსტანზე მივა გაშვებული რექვესტი.
```bash
  curl localhost:8080/api
```

#### გავუშვათ სტრესს ტესტი `autocanonn`-ის საშუეალებით, უბრალოდ გავიგოთ რამდენი რექვესტის მიღება შეუძლია 200 ქონექშენზე 20 წამის განმავლობაში ჩვენს ბალანსერს.

```bash
autocannon -c 200 -d 20 http://localhost:8080
```


