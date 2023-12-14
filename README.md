# To build and run loons-frontend
```shell
cd loons-frontend
```
```shell
npm intall
```
```shell
npm run dev
```

# To build and run loons-backend
```shell
cd loons-backend
```
```shell
npm intall
```
```shell
npx rollup -c; node .\output\index.js
```

## Discuss potential bugs or exploits with either the game mechanics or the RPC interface. How can we make it more robust? How would you improve the overall architecture?
### Potential bugs
#### 1. In my current implementation, the loons after getting created are not deleted after they exit the canvas. Because of this, the turrets keep targeting them.
#### 2. There is an integrity issue between the front end and back end, some loons might be seen getting stuck on the canvas. 

### Increasing Robustness
#### 1. Adding validations on the backend to check if the loons getting popped on the frontend are getting deleted on the backend storage.
#### 2. One more thing, if we try to open multiple tabs, the loons get stuck in the previously opened tabs, but the turrets are working fine. This is because the state mapping for the loons is shared. One way to solve this is to create new state mapping everytime data is getting pulled from the websocket.

### Improving Architecture
#### 1. Making the back end secure. Currently, there are no security measures implemented and gamers will easily be able to find ways to hack into the system. 
#### 2. Adding validations on the back end to validate the state of the loons getting popped on the front end. 
- Setting up a reconciliation mechanism to solve the integrity issue mentioned above. We can do this in a couple of ways. 
  - From the Back end: Sending deletion message along with the patching message from the back end to the front end, so that the loons getting popped on the front end will be erased from back end. 
  - From the Front end: Another way is for the front end to maintain a separate set that stores all the ids of the popped loons. When the loons get fetched from the back end, if the ids from the set are present in the map from back end, these ids will be filtered out.
#### 3. Adding authentication for the players so that their game data will be saved.
#### 4. Making the game multiplayer
#### 5. Adding a scoring mechanism so that the players can see their global score. 
