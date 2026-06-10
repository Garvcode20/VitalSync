export async function connectHeartRateMonitor(onHeartRateUpdate, onDisconnect) {
  try {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth API is not supported in your browser. Please use Chrome or Edge on a compatible device.');
    }

    // Request a Bluetooth device that advertises the standard Heart Rate service
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }]
    });

    // Handle unexpected disconnections
    device.addEventListener('gattserverdisconnected', () => {
      if (onDisconnect) onDisconnect();
    });

    // Connect to the GATT server
    const server = await device.gatt.connect();
    
    // Get the Heart Rate service
    const service = await server.getPrimaryService('heart_rate');
    
    // Get the Heart Rate Measurement characteristic
    const characteristic = await service.getCharacteristic('heart_rate_measurement');

    // Start receiving notifications
    await characteristic.startNotifications();

    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const value = event.target.value;
      
      // Parse the Heart Rate value (standard GATT profile)
      const flags = value.getUint8(0);
      const rate16Bits = flags & 0x1;
      let heartRate;
      
      if (rate16Bits) {
        heartRate = value.getUint16(1, /*littleEndian=*/true);
      } else {
        heartRate = value.getUint8(1);
      }
      
      if (onHeartRateUpdate) {
        onHeartRateUpdate(heartRate);
      }
    });

    return device;
  } catch (error) {
    console.error("Bluetooth connection failed:", error);
    throw error;
  }
}

export function disconnectDevice(device) {
  if (device && device.gatt && device.gatt.connected) {
    device.gatt.disconnect();
  }
}
