import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Pressable,
    ScrollView,
} from "react-native";
import Button from "@/components/Button";
import {useState} from "react/index";
import {defaultImage} from "@/components/ProductListItem";
import * as ImagePicker from 'expo-image-picker';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct} from "../../../api/products";
import React, {useEffect} from "react";
import * as FileSystem from 'expo-file-system';
import {randomUUID} from "expo-crypto";
import {supabase} from "@/lib/supabase";
import {decode} from "base64-arraybuffer";
import {useCategoryListAdmin} from "@/api/category";
import {Picker} from "@react-native-picker/picker";
import {useAuth} from "@/providers/AuthProvider";
import {useRestoran} from "@/api/restorans";
import {useQueryClient} from "@tanstack/react-query";
import {
    useAddon,
    useAddonOld,
    useInsertProductAddons,
    useInsertProductSize, useSize,
    useSizeOld,
    useUpdateProductAddons, useUpdateProductSizes
} from "@/api/addons_sizes";
import RemoteImage from "@/components/RemoteImage";
import LottieView from "lottie-react-native";
 import {Image} from "react-native";

const CreateProductScreen=()=>{
    const [name,setName]=useState('');
    const [price,setPrice]=useState('');
    const [priceOld,setPriceOld]=useState('');
    const [errors,setErrors]=useState('');
    const [image, setImage] = useState<string | null>(null);
    const {id:idString}=useLocalSearchParams();
    const id=parseFloat(typeof idString==='string'?idString:idString?.[0]);
    const isUpdating=!!idString;
    const {session}=useAuth();
    const userId=session?.user.id;
    const queryClient = useQueryClient();
    const restoranID=useRestoran(userId);
    const { data: categories, isLoading } = useCategoryListAdmin();
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedCategoryFirst, setSelectedCategoryFirst] = useState<number | null>(null);
    const {mutate:insertProduct}=useInsertProduct();
    const {mutate:updateProduct}=useUpdateProduct();
    const {mutate:insertProductAddons}=useInsertProductAddons();
    const {mutate:insertProductSize}=useInsertProductSize();
    const {data:updatingProduct}=useProduct(id);
    const {mutate:updateProductAddons}=useUpdateProductAddons();
    const {mutate:updateProductSizes}=useUpdateProductSizes();
    const { data: updatingProductAddon } = id ? useAddon(id) : { data: null };
    const { data: updatingProductSize } = id ? useSize(id) : { data: null };
    const {mutate:deleteProduct}=useDeleteProduct();
    const router=useRouter();

    const [newAddon, setNewAddon] = useState('');
    const [addonsList, setAddonsList] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState({});
    const {data:availableAddons,isLoading:loadingAddon,error}=useAddonOld();
    const [sizesList, setSizesList] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [newSizePrice, setNewSizePrice] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [isAddingNewSize, setIsAddingNewSize] = useState(false);
    const {data:availableSizes,isLoading:loadingSize}=useSizeOld();
    const [note, setNote] = useState('');
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

    const toggleAddonSelection = (addonId) => {
        setSelectedAddons((prevSelected) => ({
            ...prevSelected,
            [addonId]: !prevSelected[addonId],
        }));
    };

    const addSelectedAddons = () => {
        const selectedAddonObjects = availableAddons.filter((addon) =>
            selectedAddons[addon.id]
        );
        setAddonsList([...addonsList, ...selectedAddonObjects]);
        setSelectedAddons({});
    };

    const addNewAddon = async () => {
        if (newAddon) {
            try {
                const { data: insertedAddon, error } = await supabase
                    .from('addons')
                    .insert([{ name: newAddon }])
                    .select();

                if (error) {
                    throw new Error(error.message);
                }
                const newAddonObj = insertedAddon[0];

                setAddonsList([...addonsList, newAddonObj]);
                setNewAddon('');

            } catch (err) {
                console.error("Greška prilikom dodavanja novog priloga:", err.message);
                alert('Greška prilikom dodavanja priloga: ' + err.message);
            }
        }
    };
    const removeAddon = (addonId) => {
        setAddonsList((prevAddons) => prevAddons.filter((addon) => addon.id !== addonId));
    };

    useEffect(()=>{
        if (updatingProduct){
            setName(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
            setSelectedCategory(updatingProduct.cat_id);
            setSelectedCategoryFirst(updatingProduct.cat_id);
            setNote(updatingProduct.description);
        }
        if(updatingProductAddon)
        {
            const addonObjects = updatingProductAddon.map(product_addons => ({
                id: product_addons.addon_id.id,
                name: product_addons.addon_id.name,
            }));
            setAddonsList(addonObjects);
        }
        if(updatingProductSize)
        {
            const addonObjects = updatingProductSize.map(product_addons => ({
                size: product_addons.size_id.size,
                price: product_addons.price,
            }));
            setSizesList(addonObjects);
        }
    },[]);

    const resetFilds=()=>{
        setName('');
        setPrice('');
        setImage(null);
        setSelectedCategory(null);
        setNote('');
        setIsLoadingAnimation(false);
    }

    const validateInput=()=>{
        setErrors('');
        if (!name){
            setErrors('Ime nije unijeto');
            return false;
        }
        if (!price){
            setErrors('Cijena nije unijeto');
            return false;
        }
        if (isNaN(parseFloat(price))){
            setErrors('Cijena nije broj');
            return false;
        }
        if (!selectedCategory){
            setErrors('Kategorija nije unijeta');
            return false;
        }
        return true;
    }
    const onSubmit=()=>{
        if (isUpdating)
        {
            onUpdate();
        }else {
            onCreate();
        }
    }

    const onCreate=async ()=>{
        setIsLoadingAnimation(true);
        if (!validateInput()){
            setIsLoadingAnimation(false);
            return;
        }
        try {
        const imagePath=await uploadImage();

        insertProduct({name,price:parseFloat(price),image:imagePath,cat_id:selectedCategory,description:note},{
            onSuccess:async (newProduct)=>{
               console.log('Inserted Product Data:', newProduct);
                const productId = Number(newProduct.id);
                await Promise.all([
                    insertProductAddons({ productId, addons: addonsList }),
                    insertProductSize({ productId, sizes: sizesList }),
                    handleCategoryUpdate(restoranID.data?.res_admin_id),
                ]);

                await queryClient.invalidateQueries('restorans_category');
                resetFilds();
                router.back();



            },
        });}
        catch (error) {
            console.error('Error creating product:', error);
        }
        finally {
            //setIsLoadingAnimation(false);
        }
        //resetFilds();
    };

    const onUpdate = async () => {
        setIsLoadingAnimation(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!validateInput()) {
            setIsLoadingAnimation(false);
            return;
        }

        try {
            const imagePath = await uploadImage();

            await updateProduct(
                { id, name, price: parseFloat(price), image: imagePath, cat_id: selectedCategory, description: note },
                {
                    onSuccess: async () => {
                        const productId = Number(id);
                        await Promise.all([
                            updateProductAddons({ productId, addons: addonsList }),
                            updateProductSizes({ productId, sizes: sizesList }),
                            handleCategoryUpdate(restoranID.data?.res_admin_id),
                        ]);
                        await queryClient.invalidateQueries('restorans_category');
                        resetFilds();

                        router.back();
                    },
                }
            );
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
           // setIsLoadingAnimation(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const onDelete=()=>{
        setIsLoadingAnimation(true)
        deleteProduct(id, {onSuccess: ()=>{
            resetFilds();
            router.replace('/(admin)');setIsLoadingAnimation(false);
            },});

    };

    const confirmDelete=()=>{
    Alert.alert("Paznja","Da li zelite da obrisete proizvod?",[
        {
            text:'Ne',
        },
        {
            text:'Obrisi',
            style:'destructive',
            onPress:onDelete,
        }
    ]);
    };
    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: 'base64',
        });
        const filePath = `${randomUUID()}.png`;
        console.log(filePath);
        const contentType = 'image/png';
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, decode(base64), { contentType });

        if (data) {
            return data.path;
        }
    };

    const handleCategoryUpdate = async (productId: number) => {
        if (selectedCategory === null) {
            return;
        }

        try {
            const categoryId = Number(selectedCategory);
            const categoryIdOld=Number(selectedCategoryFirst);
            const { data: restoransData, error: restoransError } = await supabase
                .from('restorans')
                .select('id')
                .eq('id', productId);

            if (restoransError) throw restoransError;

            if (!(restoransData) || restoransData.length === 0) {
                throw new Error('Restorans ID ne postoji u tabeli restorans.');
            }
            const { data, error } = await supabase
                .from('restorans_category')
                .select('*')
                .eq('restorans_id', productId)
                .eq('category_id', categoryId);

            if (error) throw error;

            if (!(data) || data.length === 0) {
                const { error: insertError } = await supabase
                    .from('restorans_category')
                    .insert([{ restorans_id: productId, category_id: categoryId }]);

                if (insertError) throw insertError;
            }
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('id')
                    .eq('res_id', productId)
                    .eq('cat_id', categoryIdOld);

                if (productError) throw productError;

                if (!productData || productData.length === 0) {
                    const { error: deleteError } = await supabase
                        .from('restorans_category')
                        .delete()
                        .eq('restorans_id', productId)
                        .eq('category_id', categoryIdOld);

                    if (deleteError) throw deleteError;
                    console.log('Kategorija je uklonjena iz restorans_category tabele, jer nema proizvoda u toj kategoriji.');
            }
        } catch (error) {
            console.error('Greška prilikom ažuriranja kategorije:', error.message);
            alert('Greška prilikom ažuriranja kategorije.');
        }
    };
    const addNewSize =async () => {
        if (sizesList.length===0)
        {
            setPriceOld(price);
            setPrice(newSizePrice);
        }

        if (selectedSize && newSizePrice) {
            setSizesList([...sizesList, { size: selectedSize, price: newSizePrice }]);
             setSelectedSize('');
            setNewSizePrice('');
        } else if (newSize && newSizePrice){
            const { data:selectedSizeNew,error: insertError } = await supabase
                .from('meal_size')
                .insert([{ size:newSize }])
                .select('*');

            if (insertError) throw insertError;

            setSizesList([...sizesList, { size: newSize, price: newSizePrice }]);
            setNewSize('');
            setNewSizePrice('');
            setIsAddingNewSize(false);
        }
        else{
            alert('Unesite veličinu i cenu.');
        }
    };

    const removeSize = (index) => {
        setSizesList(sizesList.filter((_, i) => i !== index));
        if (sizesList.length===1){
            setPrice(priceOld);
        }
    };


    const handleSizeChange = (itemValue) => {
        if (itemValue === 'addNew') {
            console.log('itemVeliu ',itemValue);
            setIsAddingNewSize(true);
        } else {
            console.log('itemVeli2 ',itemValue);
            setSelectedSize(itemValue);
           // setNewSize(itemValue);
            setIsAddingNewSize(false);
        }
    };

        if (isLoading || loadingAddon ||loadingSize) {
            return <Text>Učitavanje kategorija...</Text>;
        }
    return(
        <View style={styles.container}>
        {isLoadingAnimation ? (
                    <LottieView
                        source={require('../../../assets/animation/animation.json')}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
            ):(
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Stack.Screen options={{ title: isUpdating ? 'Uredi proizvod' : 'Kreiraj proizvod' }} />

                {isUpdating ? (
                <RemoteImage
                    path={image}
                    fallback={defaultImage}
                    style={styles.image}
                    resizeMode='cover'
                />):(
                <Image source={{ uri: image }} style={styles.image} />
                    )}
                <Text onPress={pickImage} style={styles.textButton}>Izaberi sliku</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ime</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Ime"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cijena ($)</Text>
                    <TextInput
                        value={price}
                        onChangeText={setPrice}
                        placeholder="9.99"
                        style={styles.input}
                        keyboardType="numeric"
                        editable={sizesList.length === 0}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Izaberite kategoriju:</Text>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        style={styles.input}
                    >
                        <Picker.Item label="Odaberite kategoriju..." value={null} />
                        {categories?.map((category) => (
                            <Picker.Item key={category.id} label={category.name} value={category.id} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Opis proizvoda:</Text>
                    <TextInput
                        value={note}
                        multiline={true}
                        onChangeText={setNote}
                        placeholder="Opis..."
                        style={[styles.input, styles.textArea]}
                    />
                </View>

                <Text style={styles.label}>Izaberite postojeće priloge:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addonScroll}>
                    {availableAddons.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() => toggleAddonSelection(item.id)}
                            style={({ pressed }) => [
                                styles.addonContainer,
                                selectedAddons[item.id] && styles.selectedAddon,
                                pressed && styles.pressed,
                            ]}
                        >
                            <Text style={styles.addonText}>{item.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
                <Button text="Dodaj izabrane priloge" onPress={addSelectedAddons} />

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Dodajte novi prilog"
                        value={newAddon}
                        onChangeText={setNewAddon}
                        style={styles.input}
                    />
                    <Button text="Dodaj novi prilog" onPress={addNewAddon} />
                </View>
                {addonsList && addonsList.length > 0  && (
                <>
                <Text style={styles.label}>Dodatni prilozi:</Text>
                {addonsList.map((item) => (
                    <Pressable key={item.id} onPress={() => removeAddon(item.id)} style={styles.addonContainer}>
                        <Text style={styles.addonText}>{item.name}</Text>
                        <Text style={styles.removeText}> x</Text>
                    </Pressable>
                ))}
                    </> )}

                <Text style={styles.label}>Dodaj veličinu</Text>
                {!isAddingNewSize ? (
                    <Picker
                        selectedValue={selectedSize}
                        onValueChange={handleSizeChange}
                        style={styles.input}
                    >
                        <Picker.Item label="Odaberite veličinu" value="" />
                        {availableSizes.map((size, index) => (
                            <Picker.Item key={index} label={size.size} value={size.size} />
                        ))}
                        <Picker.Item label="Dodaj novu veličinu" value="addNew" />
                    </Picker>
                ) : (
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Unesite novu veličinu"
                            value={newSize}
                            onChangeText={setNewSize}
                            style={styles.input}
                        />
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Cijena za tu veličinu"
                        value={newSizePrice}
                        onChangeText={setNewSizePrice}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <Button text="Dodaj veličinu" onPress={addNewSize} />
                </View>

                {sizesList && sizesList.length > 0  && (
                    <>
                <Text style={styles.label}>Veličine i cijene:</Text>
                {sizesList.map((item, index) => (
                    <Pressable key={index} onPress={() => removeSize(index)} style={styles.addonContainer}>
                        <Text style={styles.addonText}>{item.size}: {item.price} KM</Text>
                        <Text style={styles.removeText}> x</Text>
                    </Pressable>
                ))}
                </>
                )}

                <Text style={styles.errorText}>{errors}</Text>
                <Button text={isUpdating ? 'Uredi' : 'Kreiraj'} onPress={onSubmit} />
                {isUpdating && (
                    <Text onPress={confirmDelete} style={styles.textButton}>Obrisi</Text>
                )}
            </ScrollView>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
      justifyContent:'center',
      alignItems:'center',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        alignSelf: 'center',
    },
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    textArea: {
        height: 95,
        textAlignVertical: 'top',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
        fontSize: 16,
    },
    textButton: {
        textAlign:'center',
        color: '#1E90FF',
        marginBottom: 16,
        textDecorationLine: 'underline',
    },
    addonText: {
        fontSize: 16,
        color: '#333',
    },
    removeText: {
        marginLeft: 8,
        color: 'red',
    },
    selectedAddon: {
        backgroundColor: '#e0e0e0',
        borderColor: '#1E90FF',
        borderWidth: 1,
    },
    pressed: {
        opacity: 0.5,
    },
    addonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginVertical: 4,
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        elevation: 1,
    },
    addonScroll: {
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    animation: {
        width: 200,
        height: 200,
    },
});

export default CreateProductScreen;