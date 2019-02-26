import { createStackNavigator,createAppContainer } from 'react-navigation';
import ImageUpload from '../screens/imageUpload/ImageUpload'
const StackNavigator = createStackNavigator({
 
    
    ImageUpload:{
        screen:ImageUpload
    }
})
  




const Navigation = createAppContainer(StackNavigator)
export default Navigation;