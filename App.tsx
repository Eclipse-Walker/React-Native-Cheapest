import React, {useState, useRef} from 'react';
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
      const priceNum = parseFloat(price);
      const volumeNum = parseFloat(volume);

      if (isNaN(priceNum) || isNaN(volumeNum)) {
        Alert.alert('Invalid input', 'Price and volume must be numbers.');
        return;
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
    let dx = 0;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        dx = gestureState.dx;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (dx < -50) {
          deleteField(index);
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair Price $</Text>
      <Text style={styles.subtitle}>
        Which one is cheaper? You can easily check!
      </Text>
      {fields.map((field, index) => (
        <Animated.View
          key={index}
          {...createPanResponder(index).panHandlers}
          style={styles.fieldRow}>
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={field.price}
            keyboardType="numeric"
            onChangeText={value => handleInputChange(index, 'price', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Volume"
            value={field.volume}
            keyboardType="numeric"
            onChangeText={value => handleInputChange(index, 'volume', value)}
          />
        </Animated.View>
      ))}
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
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
});

export default App;
