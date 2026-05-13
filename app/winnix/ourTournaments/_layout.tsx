import { Stack } from "expo-router";

const OurTournaments = () => (
  //   <>
  //     <View>
  //       <Text>Hola mundo</Text>
  //     </View>
  //   </>
  <Stack>
    <Stack.Screen
      name='index'
      options={{
        headerShown: false,
        // title: "Selecciona el deporte que desees",
      }}
    />
    <Stack.Screen
      name='[id]/index'
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name='tournament/[id]'
      options={{
        headerShown: false,
      }}
    />
    {/* <Stack.Screen
        name='player/[id]'
        options={{
          // title: "Detalles del jugador",
          // headerStyle: {
          //   backgroundColor: Colors.dark,
          // },
          // headerTintColor: Colors.primary,
          // headerBackTitle: "volver",
          // headerTitleStyle: {
          //   fontWeight: "bold",
          //   fontSize: 22,
          // },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='team/[id]'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='gameRecordsView/[id]'
        options={{
          headerShown: false,
        }}
      /> */}
  </Stack>
);

export default OurTournaments;
