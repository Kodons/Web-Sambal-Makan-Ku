function generateCRC16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
}

// Fungsi utama untuk mengubah string QRIS statis menjadi dinamis
export function generateDynamicQris(staticQrisString, amount) {
    if (!staticQrisString) {
        throw new Error("Data QRIS statis tidak ditemukan.");
    }

    // 1. Inisialisasi objek untuk menampung komponen QRIS
    const qris_component = {};

    // 2. Bongkar string QRIS statis menjadi komponen-komponennya
    let remaining_string = staticQrisString;
    while (remaining_string.length > 0) {
        const tag = remaining_string.substring(0, 2);
        const length = parseInt(remaining_string.substring(2, 4));
        const value = remaining_string.substring(4, 4 + length);
        
        // Simpan komponen ke objek, kecuali CRC (tag '63')
        if (tag !== '63') {
            qris_component[tag] = { length, value };
        }
        
        remaining_string = remaining_string.substring(4 + length);
    }

    // 3. Modifikasi komponen yang diperlukan
    // '01' adalah Point of Initiation, '11' statis, '12' dinamis
    qris_component['01'].value = '12';

    // '53' adalah Transaction Currency, harus '360' untuk IDR
    qris_component['53'] = { length: 3, value: '360' };
    
    // '54' adalah Transaction Amount. Ini yang kita tambahkan.
    const amountStr = String(amount);
    qris_component['54'] = { length: amountStr.length, value: amountStr };

    // 4. Susun kembali string QRIS dari komponen yang sudah dimodifikasi
    let final_string = "";
    // Urutan tag QRIS sangat penting. Kita susun manual di sini.
    const tagOrder = [
        '00', '01', '26', '27', '28', '29', '30', '31', '32', '33',
        '34', '35', '36', '37', '38', '39', '40', '41', '42', '43',
        '44', '45', '46', '47', '48', '49', '50', '51',
        '52', '53', '54', // <-- Posisi nominal sudah pasti benar di sini
        '58', '59', '60', '61', '62', '64'
    ];
    
    tagOrder.forEach(tag => {
        if (qris_component[tag]) {
            const component = qris_component[tag];
            const lengthStr = ('0' + component.length).slice(-2);
            final_string += tag + lengthStr + component.value;
        }
    });

    // 5. Tambahkan tag CRC ('6304') dan hitung CRC yang baru
    const dataUntukCrc = final_string + '6304';
    const newCrc = generateCRC16(dataUntukCrc);

    return dataUntukCrc + newCrc;
}