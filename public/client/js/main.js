let map;
let marker;
let selectedPhotos = [];

// Initialize map when document is loaded
document.addEventListener('DOMContentLoaded', async function() {
    initMap();
    setupFormValidation();
    setupPhotoHandling();
    setupHeaderScroll();

    try {
        const response = await fetch("http://localhost:3000/api/getEmail", {
          method: "GET",
          credentials: "include", // باش تبعث الكوكي تاع السيشن
        });
    
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
    
        const data = await response.json();
      document.getElementById('email').value = data.email;
      } catch (error) {
        console.error(error);
      }
});

// Header scroll effect
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;
    let lastScroll = 0;

    // Add padding to body to account for fixed header
    document.body.style.paddingTop = `${headerHeight}px`;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
            header.style.transform = `translateY(-${headerHeight}px)`;
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

function mapError() {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
        mapDiv.innerHTML = '<div class="alert alert-danger text-center p-3">Sorry, there was an error loading the map. Please refresh the page or check your internet connection.</div>';
    }
}

function initMap() {
    try {
        // Ain Defla coordinates
        const ainDeflaCenter = [36.265, 1.968];
        const ainDeflaBounds = [
            [36.21, 1.92], // Southwest corner
            [36.32, 2.02]  // Northeast corner
        ];

        // Initialize map
        map = L.map('map', {
            center: ainDeflaCenter,
            zoom: 13,
            minZoom: 12,
            maxZoom: 18,
            maxBounds: ainDeflaBounds,
            maxBoundsViscosity: 1.0
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add a rectangle to show Ain Defla boundaries
        L.rectangle(ainDeflaBounds, {
            color: "#FF0000",
            weight: 1,
            fillColor: "#FF0000",
            fillOpacity: 0.05
        }).addTo(map);

        // Create marker
        marker = L.marker(ainDeflaCenter, {
            draggable: true,
            title: 'Click and drag to select location'
        }).addTo(map);

        // Update location when marker is dragged
        marker.on('dragend', function(event) {
            updateLocation(event.target.getLatLng());
        });

        // Update marker and location when map is clicked
        map.on('click', function(event) {
            const clickedPoint = event.latlng;
            if (isPointInBounds(clickedPoint, ainDeflaBounds)) {
                marker.setLatLng(clickedPoint);
                updateLocation(clickedPoint);
            } else {
                alert("Please select a location within Ain Defla area");
            }
        });

        // Set initial form values
        updateLocation(L.latLng(ainDeflaCenter[0], ainDeflaCenter[1]));

    } catch (error) {
        console.error("Error initializing map:", error);
        mapError();
    }
}

function isPointInBounds(point, bounds) {
    return point.lat >= bounds[0][0] && point.lat <= bounds[1][0] &&
           point.lng >= bounds[0][1] && point.lng <= bounds[1][1];
}

function updateLocation(latlng) {
    try {
        // Update hidden inputs
        document.getElementById("latitude").value = latlng.lat;
        document.getElementById("longitude").value = latlng.lng;
        
        // Update address field with coordinates
        document.getElementById("address").value = `Ain Defla (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`;
        document.getElementById("address").classList.remove('is-invalid');
        
        // Center map on new location
        map.panTo(latlng);
    } catch (error) {
        console.error("Error updating location:", error);
        alert("An error occurred while updating the location. Please try again.");
    }
}

function setupPhotoHandling() {
    const photoButton = document.getElementById('photoButton');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');

    photoButton.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('الرجاء اختيار ملفات صور فقط / Veuillez sélectionner uniquement des fichiers image');
                return;
            }
            
            if (file.size > maxSize) {
                alert('حجم الصورة كبير جداً. الحد الأقصى هو 5 ميغابايت / Image trop grande. Maximum 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const container = document.createElement('div');
                container.className = 'photo-preview-container';

                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-photo';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = function() {
                    container.remove();
                    selectedPhotos = selectedPhotos.filter(p => p !== file);
                };

                container.appendChild(img);
                container.appendChild(removeBtn);
                photoPreview.appendChild(container);
                selectedPhotos.push(file);
            };
            reader.readAsDataURL(file);
        });
    });
}

function setupFormValidation() {
    const form = document.getElementById('complaintForm');

    // Real-time field validation
    const validateField = (field) => {
        let isValid = true;
        
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field.type === 'email' && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field.value)) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
        
        return isValid;
    };

    // Add real-time validation to all fields
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate all required fields
        form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for email
        const email = document.getElementById('email');
        if (!email.value || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        }

        // Validate location selection
        if (!document.getElementById('latitude').value || !document.getElementById('longitude').value) {
            document.getElementById('address').classList.add('is-invalid');
            isValid = false;
        }

        // Validate complaint text length
        const reclamation = document.getElementById('reclamation');
        if (reclamation.value.length < 10 || reclamation.value.length > 500) {
            reclamation.classList.add('is-invalid');
            isValid = false;
        }

        // Validate photos
        if (selectedPhotos.length === 0) {
            alert('Veuillez joindre au moins une photo');
            isValid = false;
        }

        if (isValid) {
            alert('Formulaire de démonstration: Réclamation envoyée avec succès');
            form.reset();
            photoPreview.innerHTML = '';
            selectedPhotos = [];
            if (marker && map) {
                const ainDeflaCenter = [36.265, 1.968];
                marker.setLatLng(ainDeflaCenter);
                map.setView(ainDeflaCenter, 13);
                document.getElementById('address').value = '';
            }
        } else {
            alert('Veuillez vérifier tous les champs requis');
        }
    });
}

//Add Reclamation

let selectedPhoto = []; // نخزن الصور هنا خارج الأحداث

const photoInput = document.getElementById('photoInput');

photoInput.addEventListener('change', () => {
  const files = photoInput.files;
  console.log("عدد الصور:", files.length);

  for (let i = 0; i < files.length; i++) {
    console.log(`الصورة ${i + 1}:`, files[i]); 
    selectedPhoto.push(files[i]);
  }
});


const btnS = document.getElementById('btnS');
  
btnS.addEventListener('click', async function (e) {
    e.preventDefault();

    const type = document.querySelector('input[name="Type"]:checked').value;
    const name = document.getElementById('nom').value.trim();
    const municipality = document.getElementById('municipality').value;
    const surname = document.getElementById('prenom').value.trim();
    const subscriber_ID = document.getElementById('codeAbonne').value.trim();
    const phone = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const complaint = document.getElementById('reclamation').value.trim();


    const formData = new FormData();

    formData.append("Name", name);
    formData.append("Type", type);
    formData.append("Surname", surname);
    formData.append("Phone", phone);
    formData.append("Municipality", municipality);
    formData.append("Subscriber_ID", subscriber_ID);
    formData.append("Address", address);
    formData.append("Email", email);
    formData.append("Complaint", complaint);

    
selectedPhoto.forEach((photo) => {
    formData.append("Photos", photo);
  });

 
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  try {
    const response = await fetch("http://localhost:3000/api/addReclamation", {
      method: "POST",
      credentials: 'include',
      body: formData 
    });

    const data = await response.json();
    DisplayReclamations();
    alert('The complaint has been added successfully.');
    document.getElementById("complaintForm").reset();
} catch (error) {
    console.error("Error fetching data:", error);
}
});

//Display Reclamations

async function DisplayReclamations(){
    try {
        const response = await fetch("http://localhost:3000/api/DisplayReclamationClient", {
          method: "GET",
          credentials: "include", // باش تبعث الكوكي تاع السيشن
        });
    
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
    
        const reclamations = await response.json();
        renderReclamations(reclamations);
        // هنا تقدر تعرضهم فـ DOM حسب الشكل لي تحب
      } catch (error) {
        console.error("❌ خطأ في جلب الشكاوى:", error);
      }
}


function renderReclamations(reclamations) {
    const containerList = document.getElementById('complaints-list');
    containerList.innerHTML = ""; // نفرغ القديم
  
    reclamations.forEach(r => {
        const dateOnly = r.createdAt.substring(0, 10);
      const item = document.createElement("div");
      item.className = 'complaint-item';
      let statusClass;
      let icon;
		if(r.Status == 'Pending'){
			statusClass = 'pending';
            icon = 'fa-exclamation-circle';
		}else if(r.Status == 'In Progress'){
			statusClass = 'in-progress';
            icon = 'fa-clock';
		}else if(r.Status == 'completed'){  
			statusClass = 'resolved'; 
            icon = 'fa-check-circle';  
		}else{
            statusClass = 'dismissed'; 
            icon = 'fa-window-close'; 
        }
      item.innerHTML = `
      <div class="complaint-header">
            <span class="complaint-date">${dateOnly}</span>
            <span class="complaint-status ${statusClass}">
                <i class= "fas ${icon}"></i>
                ${r.Status}
            </span>  
        </div> 
        <div class="complaint-content">
            <p class="complaint-text">${r.Complaint}</p>
            <div class="complaint-details">
                <span><i class="fas fa-map-marker-alt"></i> ${r.Address}</span>
                <span><i class="fas fa-tag"></i> ${r.Type}</span>
            </div>
        </div>
      `;
      containerList.appendChild(item);
    });
  }

  window.onload = DisplayReclamations;