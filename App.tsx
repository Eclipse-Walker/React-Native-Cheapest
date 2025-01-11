import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  PanResponder,
  Animated,
} from 'react-native';

interface Field {
  price: string;
  volume: string;
}

const App: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([
    {price: '', volume: ''},
    {price: '', volume: ''},
  ]);

  const addPriceField = () => {
    setFields([...fields, {price: '', volume: ''}]);
  };

  const handleInputChange = (
    index: number,
    field: keyof Field,
    value: string,
  ) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const deleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const checkPrices = () => {
    let cheapestIndex = -1;
    let cheapestPricePerVolume = Infinity;

    for (let i = 0; i < fields.length; i++) {
      const {price, volume} = fields[i];
      let priceNum = parseFloat(price);
      let volumeNum = parseFloat(volume);

      if (isNaN(priceNum) || isNaN(volumeNum)) {
        priceNum = 0;
        volumeNum = 0;
        // Alert.alert('Invalid input', 'Price and volume must be numbers.');
        // return;
      }

      const pricePerVolume = priceNum / volumeNum;
      if (pricePerVolume < cheapestPricePerVolume) {
        cheapestPricePerVolume = pricePerVolume;
        cheapestIndex = i;
      }
    }

    if (cheapestIndex !== -1) {
      Alert.alert(
        'Cheapest Item',
        `Item ${cheapestIndex + 1} is the cheapest.`,
      );
    }
  };

  const createPanResponder = (index: number) => {
    const translateX = new Animated.Value(0);

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.timing(translateX, {
            toValue: -500,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            deleteField(index);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    });

    return {panResponder, translateX};
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair Price $</Text>
      <Text style={styles.subtitle}>
        Which one is cheaper? You can easily check!
      </Text>
      {fields.map((field, index) => {
        const {panResponder, translateX} = createPanResponder(index);

        return (
          <View key={index} style={styles.swipeContainer}>
            <View style={styles.deleteBackground}>
              <Text style={styles.deleteText}>Delete</Text>
            </View>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.fieldForeground,
                {
                  transform: [{translateX}],
                },
              ]}>
              <TextInput
                style={[styles.input, styles.textField]}
                placeholder="Price"
                value={field.price}
                keyboardType="numeric"
                onChangeText={value => handleInputChange(index, 'price', value)}
              />
              <TextInput
                style={[styles.input, styles.textField]}
                placeholder="Volume"
                value={field.volume}
                keyboardType="numeric"
                onChangeText={value =>
                  handleInputChange(index, 'volume', value)
                }
              />
            </Animated.View>
          </View>
        );
      })}
      <Button title="Add Price Field" onPress={addPriceField} />
      <Button title="Check!" onPress={checkPrices} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  swipeContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  fieldForeground: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#fff',
    backgroundColor: '#f8f8f8',
    padding: 0,
    borderRadius: 0,
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
  },
  textField: {
    // backgroundColor: '#f0f0f0',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default App;
