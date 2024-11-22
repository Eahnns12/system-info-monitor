use sysinfo::{CpuRefreshKind, RefreshKind, System, MINIMUM_CPU_UPDATE_INTERVAL};

#[derive(serde::Serialize)]
struct SystemInfo {
    name: Option<String>,
    kernel_version: Option<String>,
    os_version: Option<String>,
    host_name: Option<String>,
    boot_time: u64,
    uptime: u64,
}

#[derive(serde::Serialize)]
struct CpuInfo {
    global_cpu_usage: f32,
}

#[derive(serde::Serialize)]
struct CpusInfo {
    names: Vec<String>,
    vendor_ids: Vec<String>,
    brands: Vec<String>,
    frequencies: Vec<u64>,
    cpu_usages: Vec<f32>,
}

#[derive(serde::Serialize)]
struct MemoryInfo {
    total_memory: u64,
    used_memory: u64,
    free_memory: u64,
    total_swap: u64,
    used_swap: u64,
    free_swap: u64,
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    return SystemInfo {
        name: System::name(),
        kernel_version: System::kernel_version(),
        os_version: System::os_version(),
        host_name: System::host_name(),
        boot_time: System::boot_time(),
        uptime: System::uptime(),
    };
}

#[tauri::command]
fn get_cpu_info() -> CpuInfo {
    let mut system =
        System::new_with_specifics(RefreshKind::new().with_cpu(CpuRefreshKind::everything()));

    std::thread::sleep(MINIMUM_CPU_UPDATE_INTERVAL);

    system.refresh_cpu_usage();

    return CpuInfo {
        global_cpu_usage: system.global_cpu_usage(),
    };
}

#[tauri::command]
fn get_cpus_info() -> CpusInfo {
    let mut system =
        System::new_with_specifics(RefreshKind::new().with_cpu(CpuRefreshKind::everything()));

    std::thread::sleep(MINIMUM_CPU_UPDATE_INTERVAL);

    system.refresh_cpu_all();

    let mut names = Vec::new();
    let mut vendor_ids = Vec::new();
    let mut brands = Vec::new();
    let mut frequencies = Vec::new();
    let mut cpu_usages = Vec::new();

    for cpu in system.cpus() {
        names.push(cpu.name().to_string());
        vendor_ids.push(cpu.vendor_id().to_string());
        brands.push(cpu.brand().to_string());
        frequencies.push(cpu.frequency());
        cpu_usages.push(cpu.cpu_usage());
    }

    return CpusInfo {
        names,
        vendor_ids,
        brands,
        frequencies,
        cpu_usages,
    };
}

#[tauri::command]
fn get_memory_info() -> MemoryInfo {
    let mut system = System::new_all();
    system.refresh_memory();

    return MemoryInfo {
        total_memory: system.total_memory(),
        used_memory: system.used_memory(),
        free_memory: system.free_memory(),
        total_swap: system.total_swap(),
        used_swap: system.used_swap(),
        free_swap: system.free_swap(),
    };
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| Ok(app.set_activation_policy(tauri::ActivationPolicy::Accessory)))
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            get_cpu_info,
            get_cpus_info,
            get_memory_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
